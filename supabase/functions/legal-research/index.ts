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
    const { query, jurisdiction } = await req.json();
    const apiKey = Deno.env.get('API_KEY');
    
    if (!apiKey) throw new Error("API_KEY environment variable not set.");
    if (!COURT_LISTENER_API_KEY) throw new Error("COURT_LISTENER_API_KEY environment variable not set.");
    
    // Step 1: Search CourtListener
    const clQuery = `${query}`;
    const searchUrl = `${COURT_LISTENER_API_URL}?q=${encodeURIComponent(clQuery)}&type=o&order_by=score desc`;
    
    const clResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Token ${COURT_LISTENER_API_KEY}`,
      },
    });

    if (!clResponse.ok) {
      console.error("CourtListener API Error:", await clResponse.text());
      throw new Error(`CourtListener API error: ${clResponse.status} ${clResponse.statusText}`);
    }

    const clData = await clResponse.json();
    // Filter out cases without plain text and take top 5
    const cases = clData.results.filter((c: any) => c.plain_text).slice(0, 5);

    if (cases.length === 0) {
      return new Response(JSON.stringify({ error: "No relevant cases with text found for your query. Please try a different search." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    const caseSnippets = cases.map((c: any) => `
      ---
      Case: ${c.case_name}
      Citation: ${c.citations.find((cit: any) => cit.type === "official")?.cite || c.citations[0]?.cite}
      Date: ${c.date_filed}
      Court: ${c.court}
      Snippet: ${c.plain_text.substring(0, 3000)}...
      ---
    `).join('\n\n');

    // Step 2: Prompt Gemini for analysis
    const prompt = `
      You are an AI Legal Research Assistant. I have a legal query and a list of case snippets found from a database.
      My query is: "${query}" for the jurisdiction of "${jurisdiction}".

      Here are the relevant case snippets:
      ${caseSnippets}

      Based on my query and the provided snippets, please provide a JSON object with the following structure. Do not include any other text or markdown formatting outside of the JSON object.
      - "summary": A concise summary of the law regarding my query, based on the provided cases.
      - "argumentStrength": An object with "assessment" (e.g., 'Strong', 'Moderate', 'Weak') and "reasoning" (a brief explanation for that assessment) for an argument related to my query.
      - "suggestedPrecedents": An array of the top 2-3 cases from the list, each with "caseName", "citation", and "reasoning" for why it's a strong precedent.
      - "caseSummaries": An array of objects, one for each provided case snippet, with "caseName", "citation", and a one-sentence "aiSummary" of its relevance to my query.
    `;
    
    const responseSchema = {
        type: "OBJECT",
        properties: {
            summary: { type: "STRING", description: "Summary of the law based on the provided cases." },
            argumentStrength: {
                type: "OBJECT",
                properties: {
                    assessment: { type: "STRING", description: "Assessment of the argument strength (e.g., Strong, Moderate, Weak)." },
                    reasoning: { type: "STRING", description: "Reasoning for the argument strength assessment." }
                },
                required: ["assessment", "reasoning"]
            },
            suggestedPrecedents: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        caseName: { type: "STRING" },
                        citation: { type: "STRING" },
                        reasoning: { type: "STRING", description: "Why this case is a strong precedent." }
                    },
                    required: ["caseName", "citation", "reasoning"]
                }
            },
            caseSummaries: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        caseName: { type: "STRING" },
                        citation: { type: "STRING" },
                        aiSummary: { type: "STRING", description: "One-sentence summary of the case's relevance." }
                    },
                    required: ["caseName", "citation", "aiSummary"]
                }
            }
        },
        required: ["summary", "argumentStrength", "suggestedPrecedents", "caseSummaries"]
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
    
    const analysis = JSON.parse(text);

    // Step 3: Combine data and return
    const relevantCases = cases.map((c: any) => {
      const citation = c.citations.find((cit: any) => cit.type === "official")?.cite || c.citations[0]?.cite;
      const summaryObj = analysis.caseSummaries.find((s: any) => s.caseName === c.case_name);
      return {
        caseName: c.case_name,
        citation: citation,
        court: c.court,
        decisionDate: c.date_filed,
        url: c.absolute_url,
        snippet: c.plain_text.substring(0, 400) + '...',
        aiSummary: summaryObj ? summaryObj.aiSummary : 'AI summary could not be generated for this case.'
      };
    });

    const finalResult = {
      summary: analysis.summary,
      argumentStrength: analysis.argumentStrength,
      suggestedPrecedents: analysis.suggestedPrecedents,
      relevantCases: relevantCases
    };

    return new Response(JSON.stringify(finalResult), {
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
