
import { GoogleGenAI, Type } from "@google/genai";
import { ContractAnalysis, CaseLawAnalysisResult, PersonProfileResult, DocketSummaryResult, PredictiveAnalyticsResult, LegalResearchResult, USCISFormQuestionnaire, USCISFormResult, Conflict, FormData } from '../types';

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

// --- Dummy implementations for missing functions ---

export async function generateSupportingDocStream(formData: FormData, onChunk: (chunk: string) => void): Promise<string> {
    console.log("Called dummy generateSupportingDocStream with formData:", formData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const text = `This is a dummy generated document for a ${formData.documentType}.`;
    onChunk(text);
    return text;
}

export async function generateClauseSuggestions(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [{ id: 'arbitration', label: 'Arbitration', description: 'Mandatory arbitration clause.' }];
}

export async function generateCustomDetailsPlaceholder(documentType: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return `Enter custom details for ${documentType}...`;
}

export async function performSmartConflictCheck(clientName: string, opposingPartiesStr: string, matterName: string): Promise<Conflict[]> {
    console.log("Dummy conflict check for:", { clientName, opposingPartiesStr, matterName });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [];
}

export async function generatePlaceholderSuggestions(content: string): Promise<string[]> {
    console.log("Dummy placeholder suggestions for content:", content);
    await new Promise(resolve => setTimeout(resolve, 500));
    return ['client_name', 'effective_date', 'company_address'];
}

export async function generateClientUpdate(caseData: any): Promise<string> {
    console.log("Dummy client update for caseData:", caseData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Dear ${caseData.clientName},\n\nThis is an update on your case, "${caseData.matterName}". Things are progressing. We will be in touch.\n\nBest,`;
}

export async function performLegalResearch(query: string, jurisdiction: string): Promise<LegalResearchResult> {
    console.log("Dummy legal research for:", { query, jurisdiction });
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        summary: "This is a dummy summary of the law.",
        argumentStrength: { assessment: 'Moderate', reasoning: "Based on mock data." },
        suggestedPrecedents: [{ caseName: "Mock v. Data", citation: "123 U.S. 456", reasoning: "This case is relevant because it is mocked." }],
        relevantCases: []
    };
}

export async function generatePromptSuggestions(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return ["What is the standard for...", "Landmark cases related to..."];
}

export async function analyzeCaseLaw(id: string): Promise<CaseLawAnalysisResult> {
    console.log("Dummy analyzeCaseLaw for id:", id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { aiSummary: "This is a dummy AI summary.", opinion: { name: "Mock Opinion" }, citedOpinions: [] };
}

export async function getPersonProfile(id: string): Promise<PersonProfileResult> {
    console.log("Dummy getPersonProfile for id:", id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { aiSummary: "This is a dummy person profile.", profile: { name: "John Doe" } };
}

export async function summarizeDocket(id: string): Promise<DocketSummaryResult> {
    console.log("Dummy summarizeDocket for id:", id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { aiSummary: "This is a dummy docket summary.", docket: { name: "Mock Docket" }, entries: [] };
}

export async function predictMotionOutcome(motionType: string, jurisdiction: string, myArgument: string, opposingArgument: string): Promise<PredictiveAnalyticsResult> {
    console.log("Dummy predictMotionOutcome for:", { motionType, jurisdiction, myArgument, opposingArgument });
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        prediction: 'Uncertain',
        confidence: 60,
        riskLevel: 'Medium',
        recommendedStrategy: "This is a mock strategy.",
        supportingCases: [],
        rawCasesFetched: 5
    };
}

export async function generateAndCheckUSCISForm(formName: string, questionnaireData: USCISFormQuestionnaire): Promise<USCISFormResult> {
    console.log("Dummy generateAndCheckUSCISForm for:", { formName, questionnaireData });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        filledData: questionnaireData,
        errorsAndWarnings: ["This is a mock warning from the AI compliance check."]
    };
}
