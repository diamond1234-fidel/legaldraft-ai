
// FIX: Declare Deno for environments where the Deno global is not recognized.
declare const Deno: any;

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { GoogleGenAI } from 'npm:@google/genai';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { contractText, state } = await req.json();
    const apiKey = Deno.env.get('API_KEY');
    if (!apiKey) {
      throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an AI legal assistant acting as a specialist attorney licensed in **${state}, USA**. Your task is to perform a detailed review of the following legal contract for potential issues, with a strong focus on compliance with the laws and common legal practices of **${state}**.

      **Primary Directive: State-Specific Compliance Analysis for ${state}**
      Your analysis must be grounded in the specific legal requirements of **${state}**. Go beyond generic contract principles.
      - Scrutinize the document for clauses that may be unenforceable or problematic under ${state}'s statutes (e.g., non-compete clauses in California, consumer protection laws in New York).
      - Identify where the document fails to include mandatory disclosures or language required by ${state} law for this type of agreement.
      - Suggest state-specific language or clauses that are customary and would strengthen the contract's validity and enforceability in ${state}.

      **Review Structure (Use this exact Markdown format):**
      1.  **Document Summary:** Briefly describe the contract's type and purpose.
      2.  **Key Clauses Analysis:** Comment on the adequacy of critical clauses present in the document.
      3.  **Risk Assessment:** Outline potential risks, ambiguities, or one-sided terms.
      4.  **State-Specific Compliance Deep Dive (${state}):** This is the most critical section.
          *   **Compliance Issues:** Clearly list any clauses that conflict with or may be invalid under ${state} law. Cite specific statutes or legal principles if possible.
          *   **Missing State-Required Clauses:** Identify any mandatory clauses or disclosures for this contract type in ${state} that are absent. Explain their purpose and why they are required.
          *   **Recommendations for ${state}:** Suggest specific modifications or additions to better align the document with ${state} legal standards and best practices.
      5.  **Overall Recommendation:** Provide a concluding summary of your findings and the document's readiness for use in ${state}.

      **Contract Text to Review:**
      ---
      ${contractText}
      ---

      Generate the comprehensive, state-focused review now.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return new Response(JSON.stringify({ text: response.text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
