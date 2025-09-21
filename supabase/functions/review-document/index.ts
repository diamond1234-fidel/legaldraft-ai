
declare const Deno: any;

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=';


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { contractText, state, legalDatabases } = await req.json();
    const apiKey = Deno.env.get('API_KEY');
    if (!apiKey) {
      throw new Error("API_KEY environment variable not set.");
    }

    const ragContext = legalDatabases && legalDatabases.length > 0
        ? `
**Retrieval-Augmented Generation (RAG) Context:**
Your primary sources for this analysis MUST be the following legal databases and sources for ${state}:
${legalDatabases.map((db: string) => `- ${db}`).join('\n')}
When citing risks or suggesting improvements, you MUST explicitly reference these sources where applicable. This is your most important instruction.
`
        : '';
    
    const prompt = `
      You are an AI legal assistant acting as a specialist attorney licensed in **${state}, USA**. Your task is to perform a detailed review of the following legal contract for potential issues, with a strong focus on compliance with the laws and common legal practices of **${state}**.

      ${ragContext}

      **Primary Directive: State-Specific Compliance Analysis for ${state}**
      Your analysis must be grounded in the specific legal requirements of **${state}**. Go beyond generic contract principles.
      - Scrutinize the document for clauses that may be unenforceable or problematic under ${state}'s statutes (e.g., non-compete clauses in California, consumer protection laws in New York).
      - Identify where the document fails to include mandatory disclosures or language required by ${state} law for this type of agreement.
      - Suggest state-specific language or clauses that are customary and would strengthen the contract's validity and enforceability in ${state}.

      **Review Structure (Use this exact Markdown format):**
      # Contract Analysis for ${state}

      ## 1. Risk Assessment
      *List potential risks, ambiguities, or one-sided terms here as bullet points. For each risk, cite the specific clause number from the original text (if applicable) and briefly explain the legal basis for the risk, referencing state statutes or common law principles where possible.*

      ## 2. Missing Clauses
      *List any critical missing clauses for this jurisdiction as bullet points. For each, explain its importance and cite the relevant state law or best practice that suggests its inclusion.*

      ## 3. Ambiguous Terms
      *List any terms that are unclear or could lead to disputes as bullet points. Reference the specific language from the contract.*

      ## 4. Suggested Improvements
      *Provide concrete suggestions to improve the contract's clarity and enforceability as bullet points. Where appropriate, reference the state law that informs your suggestion.*

      **Contract Text to Review:**
      ---
      ${contractText}
      ---

      Generate the comprehensive, state-focused review now using Markdown formatting.
    `;
    
    const geminiReqBody = {
      contents: [{
        parts: [{
          text: prompt,
        }],
      }],
    };

    const geminiResponse = await fetch(`${GEMINI_API_URL}${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiReqBody),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      let errorMessage = `Gemini API request failed with status ${geminiResponse.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      console.error("Gemini API Error:", errorMessage);
      throw new Error(errorMessage);
    }

    const geminiData = await geminiResponse.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
        console.error("Unexpected Gemini API response structure:", geminiData);
        throw new Error("No text content returned from Gemini API.");
    }

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });


  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
