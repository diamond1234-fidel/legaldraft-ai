

// FIX: Declare Deno for environments where the Deno global is not recognized.
declare const Deno: any;

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { GoogleGenAI } from 'npm:@google/genai';

interface CaseData {
    clientName: string;
    matterName: string;
    matterStatus: 'open' | 'closed';
    recentDocuments: { name: string; created_at: string; type: string }[];
    openTasks: { title: string; due_date: string }[];
    recentNotes: { content: string; created_at: string }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const caseData: CaseData = await req.json();
    const apiKey = Deno.env.get('API_KEY');
    if (!apiKey) {
      throw new Error("API_KEY environment variable not set.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format the case data into a readable string for the prompt
    let recentActivity = '';
    if (caseData.recentDocuments.length > 0) {
        recentActivity += 'Recent Documents:\n' + caseData.recentDocuments.map(d => `- ${d.name} (${d.type}) created on ${new Date(d.created_at).toLocaleDateString()}`).join('\n') + '\n\n';
    }
    if (caseData.openTasks.length > 0) {
        recentActivity += 'Upcoming Tasks/Deadlines:\n' + caseData.openTasks.map(t => `- ${t.title} (Due: ${t.due_date ? new Date(t.due_date).toLocaleDateString() : 'N/A'})`).join('\n') + '\n\n';
    }
     if (caseData.recentNotes.length > 0) {
        recentActivity += 'Recent Case Notes:\n' + caseData.recentNotes.map(n => `- Note from ${new Date(n.created_at).toLocaleDateString()}: "${n.content}"`).join('\n') + '\n\n';
    }
    if (recentActivity === '') {
        recentActivity = 'No recent activity to report. The case is ongoing.';
    }


    const prompt = `
      You are a helpful legal assistant drafting a status update for a client. Your tone should be professional, reassuring, and easy to understand. Avoid overly technical legal jargon.
      Your task is to synthesize the following case information into a brief email update for the client.

      **Case Information:**
      - Client Name: ${caseData.clientName}
      - Matter: "${caseData.matterName}"
      - Current Status: ${caseData.matterStatus}

      **Summary of Recent Activity:**
      ${recentActivity}

      **Instructions:**
      1.  Start with a polite salutation (e.g., "Dear ${caseData.clientName},").
      2.  Briefly state the purpose of the email (a progress update on their case).
      3.  Summarize the key recent activities in 2-3 sentences.
      4.  Conclude with a reassuring closing, letting them know you are managing the case diligently and they can reach out with questions.
      5.  End with a professional sign-off (e.g., "Best regards,").
      
      Generate the client update email now.
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