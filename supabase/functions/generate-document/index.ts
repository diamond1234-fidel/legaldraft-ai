
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
    const { formData } = await req.json();
    const apiKey = Deno.env.get('API_KEY');
    if (!apiKey) {
      throw new Error("API_KEY environment variable not set.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const selectedOptionalClauses = Object.entries(formData.optionalClauses)
      .filter(([, isSelected]) => isSelected)
      .map(([key]) => key)
      .join(', ');

    const prompt = `
      You are an AI legal assistant acting as an expert in drafting legal documents compliant with United States law, with a specialization in the laws of **${formData.state}**.
      Your task is to generate a professional, lawyer-friendly legal document based on the provided specifications. The document must not only be well-formatted but also deeply incorporate the legal nuances, common practices, and statutory requirements of the specified jurisdiction.
      
      **Primary Directive: State-Specific Customization for ${formData.state}**
      This is the most critical instruction. The generated document's clauses, definitions, and overall structure must reflect the specific legal landscape of **${formData.state}**. For example, if drafting a residential lease for California ('USA-CA'), you must include clauses related to the Costa-Hawkins Rental Housing Act or specific security deposit regulations (Civil Code § 1950.5). If for Texas ('USA-TX'), landlord-tenant laws from the Texas Property Code must be reflected. Prioritize this state-specific tailoring above all else.

      **Document Specifications:**
      1.  **Document Type:** ${formData.documentType}
      2.  **Governing Law (State):** ${formData.state}, USA.
      3.  **Party A (e.g., Disclosing Party, Landlord, Employer):**
          *   Name: ${formData.partyA_name || 'Not Specified'}
          *   Address: ${formData.partyA_address || 'Not Specified'}
      4.  **Party B (e.g., Receiving Party, Tenant, Employee):**
          *   Name: ${formData.partyB_name || 'Not Specified'}
          *   Address: ${formData.partyB_address || 'Not Specified'}
      5.  **Effective Date:** ${formData.effectiveDate}
      6.  **Optional Clauses to Include:** ${selectedOptionalClauses || 'None'}
      7.  **Other Custom Details/Context:** ${formData.customDetails || 'None'}

      **Formatting Instructions:**
      *   Use Markdown for formatting.
      *   Start with a clear title.
      *   Include an introductory paragraph identifying the parties and the effective date.
      *   Use numbered sections for all major clauses (e.g., 1. Definitions, 2. Term).
      *   Use sub-clauses (e.g., 3.1, 3.2 or a, b, c) where appropriate.
      *   Bold key terms or headings.
      *   Conclude with a proper closing statement and formatted signature blocks.

      Generate the state-compliant document now.
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
