// FIX: Declare Deno for environments where the Deno global is not recognized.
declare const Deno: any;

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { GoogleGenAI, Type } from 'npm:@google/genai';

interface Party {
    name: string;
    counsel?: string;
}

interface Matter {
    id: string;
    matter_name: string;
    client_id: string;
    opposing_parties: Party[] | null;
}

interface Client {
    id: string;
    name: string;
}

interface RequestPayload {
    clientName: string;
    opposingParties: Party[];
    allClients: Client[];
    allMatters: Matter[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { clientName, opposingParties, allClients, allMatters }: RequestPayload = await req.json();
    const apiKey = Deno.env.get('API_KEY');
    if (!apiKey) {
      throw new Error("API_KEY environment variable not set.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const clientMap = new Map(allClients.map(c => [c.id, c.name]));

    const pastMattersSummary = allMatters.map(matter => {
        const client = clientMap.get(matter.client_id) || 'Unknown Client';
        const opponents = (matter.opposing_parties || []).map(p => p.name).join(', ');
        return `- Matter: "${matter.matter_name}" (ID: ${matter.id}), Client: ${client}, Opposing Parties: ${opponents || 'N/A'}`;
    }).join('\n');

    const newPartiesList = [clientName, ...opposingParties.map(p => p.name)].filter(Boolean).join(', ');

    const prompt = `
      You are an AI assistant helping a law firm perform a conflict of interest check.
      Your task is to identify potential conflicts between a new set of parties and a historical list of matters.
      Go beyond exact matches. Look for variations in names (e.g., "Corp" vs "Corporation", typos, initials) and potential relationships.

      **New Parties to Check:**
      ${newPartiesList}

      **Historical List of Matters:**
      ${pastMattersSummary}

      **Analysis Instructions:**
      1.  Compare each "New Party" against every "Client" and "Opposing Party" in the "Historical List".
      2.  If a potential conflict is found, create a JSON object for it.
      3.  A conflict exists if a new party's name is the same as, or very similar to, a past client or opposing party.
      4.  For each conflict, provide a brief "reason" explaining why it was flagged (e.g., "Exact match with past client", "Similar name to opposing party", "Possible corporate affiliate").

      Return a JSON array of all potential conflicts you find. If no conflicts are found, return an empty array.
    `;
    
    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          matchedName: { type: Type.STRING },
          conflictType: { type: Type.STRING, enum: ['Past Client', 'Past Opposing Party'] },
          conflictingMatterId: { type: Type.STRING },
          conflictingMatterName: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ["matchedName", "conflictType", "conflictingMatterId", "conflictingMatterName", "reason"],
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    return new Response(response.text, {
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
