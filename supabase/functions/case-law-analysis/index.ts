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
    const { opinion_id } = await req.json();
    const apiKey = Deno.env.get('API_KEY');

    if (!apiKey) throw new Error("API_KEY environment variable not set.");
    if (!COURT_LISTENER_API_KEY) throw new Error("COURT_LISTENER_API_KEY not set.");
    if (!opinion_id) throw new Error("Missing opinion_id");

    const ai = new GoogleGenAI({ apiKey });
    const headers = { 'Authorization': `Token ${COURT_LISTENER_API_KEY}` };

    // Fetch opinion and cited opinions in parallel
    const [opinionRes, citedRes] = await Promise.all([
      fetch(`${COURT_LISTENER_API_URL}opinions/${opinion_id}/`, { headers }),
      fetch(`${COURT_LISTENER_API_URL}opinions-cited/?citing_opinion=${opinion_id}`, { headers })
    ]);

    if (!opinionRes.ok) throw new Error(`CourtListener Opinion API Error: ${opinionRes.statusText}`);
    if (!citedRes.ok) throw new Error(`CourtListener Cited API Error: ${citedRes.statusText}`);

    const opinionData = await opinionRes.json();
    const citedData = await citedRes.json();

    const prompt = `
      You are a legal assistant. Summarize the following case opinion and how it has been cited:
      
      Case: ${opinionData.case_name || 'N/A'}
      Court: ${opinionData.cluster?.court || 'N/A'}
      Date: ${opinionData.date_filed || 'N/A'}
      Opinion text (excerpt): ${opinionData.plain_text?.substring(0, 4000) || ''}...
      
      This opinion has been cited by ${citedData.count || 0} other cases.
      
      Provide a concise summary of the core legal holding of this opinion and briefly describe its significance based on the number of citations.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const aiSummary = response.text;

    return new Response(JSON.stringify({
      opinion: opinionData,
      citedOpinions: citedData.results || [],
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