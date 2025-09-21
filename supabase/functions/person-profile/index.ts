
declare const Deno: any;

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=';
const COURT_LISTENER_API_KEY = Deno.env.get('COURT_LISTENER_API_KEY')!;
const COURT_LISTENER_API_URL = 'https://www.courtlistener.com/api/rest/v3/people/';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { person_id } = await req.json();
    const apiKey = Deno.env.get('API_KEY');

    if (!apiKey) throw new Error("API_KEY environment variable not set.");
    if (!COURT_LISTENER_API_KEY) throw new Error("COURT_LISTENER_API_KEY not set.");
    if (!person_id) throw new Error("Missing person_id");

    const headers = { 'Authorization': `Token ${COURT_LISTENER_API_KEY}` };

    const personRes = await fetch(`${COURT_LISTENER_API_URL}${person_id}/`, { headers });
    if (!personRes.ok) throw new Error(`CourtListener Person API Error: ${personRes.statusText}`);
    
    const personData = await personRes.json();
    
    const prompt = `
      Provide a concise professional profile summary for this legal figure based on the following data.
      Format the summary in well-structured markdown paragraphs.

      Name: ${personData.name}
      Positions Held: ${JSON.stringify(personData.positions)}
      Education: ${JSON.stringify(personData.educations)}
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiReqBody),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.json();
      throw new Error(`Gemini API request failed: ${errorBody.error?.message || geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    const aiSummary = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiSummary) throw new Error("No summary returned from Gemini API.");

    return new Response(JSON.stringify({
      profile: personData,
      aiSummary: aiSummary,
    }), {
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
