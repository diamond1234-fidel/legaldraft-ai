// @ts-ignore
declare const Deno: any;

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const GEMINI_API_URL_STREAM = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { formData } = await req.json();
    const apiKey = Deno.env.get('API_KEY');
    if (!apiKey) {
      throw new Error("API_KEY environment variable not set.");
    }
    
    // Using the high-quality, immigration-specific prompt
    const selectedOptionalClauses = Object.entries(formData.optionalClauses || {})
      .filter(([, isSelected]) => isSelected)
      .map(([key]) => key)
      .join(', ');

    const prompt = `
      You are an AI legal assistant specializing in U.S. immigration law.
      Your task is to generate a professional, lawyer-friendly supporting document for an immigration case. The document must be well-formatted, persuasive, and tailored to the specific context provided.
      
      **Document Specifications:**
      1.  **Document Type:** ${formData.documentType} (e.g., Affidavit of Support, Cover Letter, Personal Statement).
      2.  **Case Context / Custom Details:** ${formData.customDetails || 'None provided. Generate a standard template.'}
      3.  **Key Individuals Involved:**
          *   Primary Applicant/Beneficiary: ${formData.partyA_name || 'Not Specified'}
          *   Sponsor/Petitioner/Declarant: ${formData.partyB_name || 'Not Specified'}
      4.  **Date:** ${formData.effectiveDate}
      5.  **Optional Clauses/Points to Include:** ${selectedOptionalClauses || 'None'}

      **Formatting Instructions:**
      *   Use Markdown for formatting.
      *   Start with a clear title and appropriate headers (e.g., "RE: I-130 Petition for [Beneficiary Name]").
      *   Include standard legal document formatting, such as formal salutations, clear paragraphs, and a proper closing with signature blocks.
      *   Where applicable, use placeholders like "[Your Name]" or "[Date]" for information that needs to be manually filled in.
      *   Ensure the tone is professional and appropriate for submission to USCIS or other government bodies.

      Generate the immigration supporting document now.
    `;

    const geminiReqBody = {
      contents: [{
        parts: [{
          text: prompt,
        }],
      }],
    };

    const geminiResponse = await fetch(`${GEMINI_API_URL_STREAM}${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiReqBody),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API request failed: ${errorText}`);
    }
    
    // Pipe the streaming response from Gemini directly to the client
    return new Response(geminiResponse.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error("Function Error:", error);
    // This part of the code won't stream an error, it will return a regular error response.
    // Client-side will see this as a failed fetch.
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
