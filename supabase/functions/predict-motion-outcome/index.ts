
// @ts-ignore
declare const Deno: any;

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=';
const COURT_LISTENER_API_KEY = Deno.env.get('COURT_LISTENER_API_KEY');
const COURT_LISTENER_API_URL = 'https://www.courtlistener.com/api/rest/v3/search/';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
        motion_type: motionType, 
        jurisdiction, 
        my_argument: ourArgument, 
        opposing_argument: opposingArgument 
    } = await req.json();
    const apiKey = Deno.env.get('API_KEY');
    
    if (!apiKey) throw new Error("API_KEY environment variable not set.");
    if (!COURT_LISTENER_API_KEY) throw new Error("COURT_LISTENER_API_KEY environment variable not set.");
    
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

      **JSON Schema is defined in the API call.**
    `;

    const responseSchema = {
        type: "OBJECT",
        properties: {
            prediction: { type: "STRING", enum: ['PlaintiffLikely', 'DefendantLikely', 'Uncertain'], description: "PlaintiffLikely means the motion will likely be granted. DefendantLikely means it will likely be denied." },
            confidence: { type: "NUMBER", description: "Confidence score from 0-100." },
            riskLevel: { type: "STRING", enum: ['Low', 'Medium', 'High'] },
            recommendedStrategy: { type: "STRING", description: "A multi-sentence or bulleted list of recommended strategies." },
            supportingCases: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        caseName: { type: "STRING" },
                        citation: { type: "STRING" },
                        reasoning: { type: "STRING" }
                    },
                    required: ["caseName", "citation", "reasoning"]
                }
            },
            rawCasesFetched: { type: "NUMBER" }
        },
        required: ["prediction", "confidence", "riskLevel", "recommendedStrategy", "supportingCases", "rawCasesFetched"]
    };
    
    const geminiReqBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    };

    const geminiResponse = await fetch(`${GEMINI_API_URL}${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiReqBody),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.json();
      throw new Error(`Gemini API request failed: ${errorBody.error?.message || geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No text content returned from Gemini API.");

    return new Response(text, {
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
