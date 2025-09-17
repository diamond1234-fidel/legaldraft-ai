// @ts-ignore
// FIX: Declare Deno for environments where the Deno global is not recognized.
declare const Deno: any;

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
// @ts-ignore
import { GoogleGenAI, Type } from 'npm:@google/genai';

const COURT_LISTENER_API_KEY = Deno.env.get('COURT_LISTENER_API_KEY');
const COURT_LISTENER_API_URL = 'https://www.courtlistener.com/api/rest/v3/search/';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // FIX: Correctly destructure and rename snake_case properties from the request body.
    const { 
        motion_type: motionType, 
        jurisdiction, 
        my_argument: ourArgument, 
        opposing_argument: opposingArgument 
    } = await req.json();
    const apiKey = Deno.env.get('API_KEY');
    
    if (!apiKey) throw new Error("API_KEY environment variable not set.");
    if (!COURT_LISTENER_API_KEY) throw new Error("COURT_LISTENER_API_KEY environment variable not set.");
    
    const ai = new GoogleGenAI({ apiKey });

    // Step 1: Search CourtListener for relevant precedents
    const searchQuery = `"${motionType}"`;
    const jurisdictionParts = jurisdiction.split('-');
    const jurisdictionCode = jurisdictionParts.length > 1 ? jurisdictionParts[1].toLowerCase() : jurisdiction.toLowerCase();
    const searchUrl = `${COURT_LISTENER_API_URL}?q=${encodeURIComponent(searchQuery)}&type=o&order_by=score desc&jurisdiction=${jurisdictionCode}`;
    
    const clResponse = await fetch(searchUrl, {
      headers: { 'Authorization': `Token ${COURT_LISTENER_API_KEY}` },
    });

    if (!clResponse.ok) {
      console.error("CourtListener API Error:", await clResponse.text());
      throw new Error(`CourtListener API error: ${clResponse.status} ${clResponse.statusText}`);
    }

    const clData = await clResponse.json();
    const cases = clData.results.filter((c: any) => c.plain_text).slice(0, 5);

    const caseSnippets = cases.map((c: any) => `
      ---
      Case: ${c.case_name}
      Citation: ${c.citations.find((cit: any) => cit.type === "official")?.cite || c.citations[0]?.cite}
      Date: ${c.date_filed}
      Holding (excerpt): ${c.plain_text.substring(0, 2000)}...
      ---
    `).join('\n\n');
    
    const prompt = `
      You are an expert legal analyst AI. Your task is to predict the outcome of a legal motion based on provided arguments and historical precedents.

      **Current Motion Details:**
      - **Motion Type:** ${motionType}
      - **Jurisdiction:** ${jurisdiction}
      - **Our Argument:** ${ourArgument}
      - **Opposing Argument:** ${opposingArgument || 'Not provided.'}

      **Historical Precedents from the Jurisdiction:**
      ${caseSnippets.length > 0 ? caseSnippets : "No specific precedents were found for this automated search. Analyze based on general legal principles for the given jurisdiction."}

      **Analysis Task:**
      Based on all the information above, provide a JSON object with your analysis. The JSON object must strictly follow the specified schema. Do not include any text or markdown formatting outside the JSON object.

      **JSON Schema:**
      - **predictedOutcome**: (string) Your prediction. Must be one of: 'Likely to be Granted', 'Likely to be Denied', 'Uncertain'.
      - **confidenceScore**: (number) Your confidence in this prediction, from 0 to 100.
      - **reasoning**: (string) A detailed explanation for your prediction, referencing the arguments and precedents. Explain the key factors influencing the likely outcome.
      - **suggestedStrategies**: (array of strings) A list of 2-3 actionable strategies to strengthen our position.
      - **identifiedRisks**: (array of strings) A list of 2-3 potential risks or weaknesses in our argument.
      - **relevantPrecedents**: (array of objects) An array of the most relevant precedents from the provided list, each with "caseName", "citation", "outcome" (e.g., "Motion Granted," "Motion Denied"), and "reasoning" (a brief explanation of its relevance).
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            predictedOutcome: { type: Type.STRING, enum: ['Likely to be Granted', 'Likely to be Denied', 'Uncertain'] },
            confidenceScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            suggestedStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
            identifiedRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
            relevantPrecedents: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        caseName: { type: Type.STRING },
                        citation: { type: Type.STRING },
                        outcome: { type: Type.STRING },
                        reasoning: { type: Type.STRING }
                    },
                    required: ["caseName", "citation", "outcome", "reasoning"]
                }
            }
        },
        required: ["predictedOutcome", "confidenceScore", "reasoning", "suggestedStrategies", "identifiedRisks", "relevantPrecedents"]
    };

    const genAIResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        },
    });

    return new Response(genAIResponse.text, {
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