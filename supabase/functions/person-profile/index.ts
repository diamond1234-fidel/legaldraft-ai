// FIX: Declare Deno for environments where the Deno global is not recognized.
declare const Deno: any;

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { GoogleGenAI } from 'npm:@google/genai';

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

    const ai = new GoogleGenAI({ apiKey });
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

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const aiSummary = response.text;

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