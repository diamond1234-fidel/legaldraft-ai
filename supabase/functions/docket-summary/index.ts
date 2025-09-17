// FIX: Declare Deno for environments where the Deno global is not recognized.
declare const Deno: any;

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { GoogleGenAI } from 'npm:@google/genai';

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

    const ai = new GoogleGenAI({ apiKey });
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

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const aiSummary = response.text;

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