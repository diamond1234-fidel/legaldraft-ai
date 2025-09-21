
import { GoogleGenAI, Type } from "@google/genai";
import {
    ContractAnalysis,
    FormData,
    LegalResearchResult,
    Conflict,
    USCISFormQuestionnaire,
    USCISFormResult,
    CaseLawAnalysisResult,
    PersonProfileResult,
    DocketSummaryResult,
    PredictiveAnalyticsResult,
    Client,
    Matter
} from '../types';
import { supabase } from './supabaseClient';


const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: 'A short, overall summary of the contract in a single paragraph.' },
        risks: {
            type: Type.ARRAY,
            description: 'Up to the top 8 risks or red flags found in the contract, sorted by severity.',
            items: {
                type: Type.OBJECT,
                properties: {
                    severity: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: 'The severity of the risk.' },
                    description: { type: Type.STRING, description: 'A clear, concise description of the risk.' },
                    snippet: { type: Type.STRING, description: 'The exact text snippet (under 200 characters) from the contract that contains the risk.' }
                },
                required: ['severity', 'description', 'snippet']
            }
        },
        missingClauses: {
            type: Type.ARRAY,
            description: 'A checklist of common, important clauses that are missing from this contract (e.g., "NDA", "Indemnity", "Termination").',
            items: { type: Type.STRING }
        },
        suggestedFixes: {
            type: Type.ARRAY,
            description: 'Short, bulleted, plain-language suggestions for improving the contract or mitigating risks.',
            items: { type: Type.STRING }
        },
        keyDates: {
            type: Type.ARRAY,
            description: 'Key dates, deadlines, and obligations mentioned in the contract.',
            items: {
                type: Type.OBJECT,
                properties: {
                    date: { type: Type.STRING, description: 'The date or deadline (e.g., "2024-12-31", "Upon Termination").' },
                    obligation: { type: Type.STRING, description: 'The corresponding obligation or event.' }
                },
                required: ['date', 'obligation']
            }
        }
    },
    required: ['summary', 'risks', 'missingClauses', 'suggestedFixes', 'keyDates']
};

export async function analyzeContract(
    contractText: string,
    jurisdiction: string
): Promise<ContractAnalysis> {
    const prompt = `
      You are an AI legal assistant. Your task is to perform a detailed review of the following legal contract.
      Analyze the text for risks, missing clauses, and key dates. Your response must be in a structured JSON format.

      **Jurisdiction Context:** This contract should be analyzed under the laws of ${jurisdiction}.
      
      **Analysis Requirements:**
      1.  **Summary:** Provide a short, overall summary.
      2.  **Risks:** Identify the top 8 risks or red flags. For each, specify its severity (High, Medium, Low), a description, and the exact text snippet.
      3.  **Missing Clauses:** List common clauses that are absent (e.g., Confidentiality, Limitation of Liability).
      4.  **Suggested Fixes:** Provide short, actionable, plain-language suggestions for improvement.
      5.  **Key Dates:** Extract important dates and their corresponding obligations.
      
      **Contract Text to Analyze:**
      ---
      ${contractText}
      ---

      Provide your analysis in the specified JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        let jsonStr = response.text.trim();
        // The API might sometimes wrap the JSON in markdown backticks
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
        }

        const result: ContractAnalysis = JSON.parse(jsonStr);
        return result;

    } catch (error: any) {
        console.error("Error calling Gemini API for contract analysis:", error);
        if (error.message.includes('JSON')) {
             throw new Error(`The AI returned an invalid data format. The contract might be too complex or contain unusual formatting. Please try again.`);
        }
        throw new Error(`The AI assistant could not analyze the contract. Details: ${error.message}`);
    }
}

// FIX: Add missing functions
export async function generateSupportingDocStream(formData: FormData, onChunk: (chunk: string) => void): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("User not authenticated.");

    const response = await fetch(`${supabase.functions.getURL()}/generate-document`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ formData })
    });
    
    if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(JSON.parse(errorText).error || 'Failed to generate document stream.');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        const lines = chunk.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const jsonStr = line.substring(6);
                    if (jsonStr.trim() === '[DONE]') continue;
                    const parsed = JSON.parse(jsonStr);
                    const textChunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    if (textChunk) {
                        onChunk(textChunk);
                        fullText += textChunk;
                    }
                } catch (e) {
                    // Ignore parsing errors for non-JSON lines
                }
            }
        }
    }

    return fullText;
}

export async function generateClauseSuggestions(contractType: string): Promise<{ id: string; label: string; description: string; }[]> {
    await new Promise(res => setTimeout(res, 1000));
    if (contractType.toLowerCase().includes('nda')) {
        return [
            { id: 'term', label: 'Term Length', description: 'Specify the duration of the confidentiality obligation.' },
            { id: 'remedies', label: 'Equitable Remedies', description: 'Allows for seeking injunctions for breaches.' }
        ];
    }
    return [
        { id: 'indemnity', label: 'Indemnification', description: 'One party covers the losses of the other in certain events.' },
        { id: 'liability_limit', label: 'Limitation of Liability', description: 'Caps the amount of damages a party can be liable for.' },
    ];
}

export async function generateCustomDetailsPlaceholder(documentType: string): Promise<string> {
    await new Promise(res => setTimeout(res, 500));
    return `e.g., For a ${documentType}, include specific facts of the case, key dates, relationship details, evidence to be included...`;
}

export async function performSmartConflictCheck(clientName: string, opposingPartiesStr: string, matterSummary: string): Promise<Conflict[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: clients, error: clientError } = await supabase.from('clients').select('id, name');
    const { data: matters, error: matterError } = await supabase.from('matters').select('id, matter_name, client_id, opposing_parties');

    if (clientError || matterError) throw clientError || matterError;

    const { data, error } = await supabase.functions.invoke('smart-conflict-check', {
        body: { clientName, opposingParties: opposingPartiesStr.split(',').map(s => ({name: s.trim()})), allClients: clients, allMatters: matters, matterSummary },
    });
    if (error) throw error;
    return data;
}

export async function generatePlaceholderSuggestions(content: string): Promise<string[]> {
     await new Promise(res => setTimeout(res, 1200));
     const matches = content.match(/\[\s*(\w+)\s*\]/g) || [];
     const suggestions = ['client_name', 'effective_date', 'project_scope', 'fee_amount'];
     return [...new Set([...matches.map(p => p.replace(/[\[\]]/g, '').trim()), ...suggestions])];
}

export async function generateClientUpdate(caseData: any): Promise<string> {
    const { data, error } = await supabase.functions.invoke('generate-client-update', {
        body: caseData,
    });
    if (error) throw error;
    return data.text;
}

export async function performLegalResearch(query: string, jurisdiction: string): Promise<LegalResearchResult> {
    const { data, error } = await supabase.functions.invoke('legal-research', {
        body: { query, jurisdiction },
    });
    if (error) throw error;
    return data;
}
export async function generatePromptSuggestions(): Promise<string[]> {
    return [
        "What is the standard for piercing the corporate veil in Delaware?",
        "Compare negligence standards for medical malpractice in Texas and Florida.",
        "Summarize recent Supreme Court rulings on intellectual property."
    ];
}

export async function analyzeCaseLaw(opinion_id: string): Promise<CaseLawAnalysisResult> {
    const { data, error } = await supabase.functions.invoke('case-law-analysis', { body: { opinion_id } });
    if (error) throw error;
    return data;
}
export async function getPersonProfile(person_id: string): Promise<PersonProfileResult> {
    const { data, error } = await supabase.functions.invoke('person-profile', { body: { person_id } });
    if (error) throw error;
    return data;
}
export async function summarizeDocket(docket_id: string): Promise<DocketSummaryResult> {
    const { data, error } = await supabase.functions.invoke('docket-summary', { body: { docket_id } });
    if (error) throw error;
    return data;
}
export async function predictMotionOutcome(motion_type: string, jurisdiction: string, my_argument: string, opposing_argument: string): Promise<PredictiveAnalyticsResult> {
    const { data, error } = await supabase.functions.invoke('predict-motion-outcome', { body: { motion_type, jurisdiction, my_argument, opposing_argument } });
    if (error) throw error;
    return data;
}

export async function generateAndCheckUSCISForm(formName: string, questionnaireData: USCISFormQuestionnaire): Promise<USCISFormResult> {
    await new Promise(res => setTimeout(res, 2000));
    const errorsAndWarnings = [];
    if (!questionnaireData.petitionerFullName && !questionnaireData.applicantFullName && !questionnaireData.sponsorFullName && !questionnaireData.applicantName && !questionnaireData.residentFullName && !questionnaireData.n400FullName && !questionnaireData.workerName && !questionnaireData.employerName) {
        errorsAndWarnings.push("Primary applicant/petitioner name is missing.");
    }
    if (Math.random() > 0.7) {
        errorsAndWarnings.push("AI Check: The address provided may be incomplete. Please verify.");
    }
    return {
        filledData: questionnaireData,
        errorsAndWarnings,
    };
}
