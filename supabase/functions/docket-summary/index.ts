
declare const Deno: any;

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=';
const COURT_LISTENER_API_KEY = Deno.env.get('COURT_LISTENER_API_KEY')!;
const COURT_LISTENER_API_URL = 'https://www.courtlistener.com/api/rest/v3/';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { docket_id } = await req.json();
    const apiKey = Deno.env.get('API_KEY');

    if (!apiKey) throw new Error("API_KEY environment variable not set.");
    if (!COURT_LISTENER_API_KEY) throw new Error("COURT_LISTENER_API_KEY not set.");
    if (!docket_id) throw new Error("Missing docket_id");

    const headers = { 'Authorization': `Token ${COURT_LISTENER_API_KEY}` };

    // Fetch docket and entries in parallel
    const [docketRes, entriesRes] = await Promise.all([
      fetch(`${COURT_LISTENER_API_URL}dockets/${docket_id}/`, { headers }),
      fetch(`${COURT_LISTENER_API_URL}docket-entries/?docket=${docket_id}`, { headers })
    ]);
    
    if (!docketRes.ok) throw new Error(`CourtListener Docket API Error: ${docketRes.statusText}`);
    if (!entriesRes.ok) throw new Error(`CourtListener Entries API Error: ${entriesRes.statusText}`);
    
    const docketData = await docketRes.json();
    const entriesData = await entriesRes.json();
    const entries = entriesData.results || [];

    const entriesText = entries.slice(0, 15).map((e: any) => `- ${e.date_filed}: ${e.description}`).join('\n');

    const prompt = `
      You are a legal assistant summarizing recent activity for a case based on its docket entries.
      Provide a clear, chronological summary of the key events.

      Case: ${docketData.case_name}
      Court: ${docketData.court_id}
      
      Recent Entries:
      ${entriesText}

      Summarize the most significant recent activity in a few bullet points.
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
      docket: docketData,
      entries: entries,
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
