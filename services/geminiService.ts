import { FormData, LegalResearchResult, CaseLawAnalysisResult, PersonProfileResult, DocketSummaryResult, PredictiveAnalyticsResult, Client, Matter, OpposingParty, Conflict } from '../types';
import { supabase } from './supabaseClient';

const LEGAL_RESEARCH_API_URL = 'https://legalcase.vercel.app/legal-research';
const ADVANCED_RESEARCH_API_URL = 'https://legalcase.vercel.app';
const SMART_CONFLICT_CHECK_API_URL = 'https://legalcase.vercel.app/smart-conflict-check';
const CLIENT_UPDATE_API_URL = 'https://legalcase.vercel.app/generate-client-update';


export async function generateDocumentPrompt(formData: FormData): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-document', {
      body: { formData },
    });
    if (error) throw error;
    return data.text;
  } catch (error: any) {
    console.error("Error invoking Supabase function 'generate-document':", error);
    throw new Error(`The AI assistant could not generate the document. Please check your inputs and try again. Details: ${error.message}`);
  }
}

export async function reviewDocument(contractText: string, state: string): Promise<string> {
  try {
     const { data, error } = await supabase.functions.invoke('review-document', {
      body: { contractText, state },
    });
    if (error) throw error;
    return data.text;
  } catch (error: any) {
    console.error("Error invoking Supabase function 'review-document':", error);
    throw new Error(`The AI assistant could not review the document. Please try again. Details: ${error.message}`);
  }
}

export async function generateClientUpdate(caseData: any): Promise<string> {
  try {
    const response = await fetch(CLIENT_UPDATE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error("Error calling client update backend:", error);
    throw new Error(`The AI assistant could not generate the client update. Details: ${error.message}`);
  }
}

export async function performLegalResearch(query: string, jurisdiction: string): Promise<LegalResearchResult> {
    try {
        const response = await fetch(LEGAL_RESEARCH_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, jurisdiction }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data as LegalResearchResult;
    } catch (error: any) {
        console.error("Error calling legal research backend:", error);
        throw new Error(`The AI research assistant failed. Details: ${error.message}`);
    }
}

export async function analyzeCaseLaw(opinionId: string): Promise<CaseLawAnalysisResult> {
    try {
        const response = await fetch(`${ADVANCED_RESEARCH_API_URL}/case-law`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ opinion_id: opinionId }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error: any) {
        console.error("Error calling case law analysis backend:", error);
        throw new Error(`The AI assistant could not analyze the case law. Details: ${error.message}`);
    }
}

export async function getPersonProfile(personId: string): Promise<PersonProfileResult> {
    try {
        const response = await fetch(`${ADVANCED_RESEARCH_API_URL}/person-research`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ person_id: personId }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error: any) {
        console.error("Error calling person profile backend:", error);
        throw new Error(`The AI assistant could not fetch the person's profile. Details: ${error.message}`);
    }
}

export async function summarizeDocket(docketId: string): Promise<DocketSummaryResult> {
    try {
        const response = await fetch(`${ADVANCED_RESEARCH_API_URL}/docket-tracking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ docket_id: docketId }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error: any) {
        console.error("Error calling docket summary backend:", error);
        throw new Error(`The AI assistant could not summarize the docket. Details: ${error.message}`);
    }
}

export async function predictMotionOutcome(
  motionType: string,
  jurisdiction: string,
  myArgument: string,
  opposingArgument: string
): Promise<PredictiveAnalyticsResult> {
  try {
    const response = await fetch(`${ADVANCED_RESEARCH_API_URL}/predictive-analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        motion_type: motionType,
        jurisdiction: jurisdiction,
        my_argument: myArgument,
        opposing_argument: opposingArgument
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as PredictiveAnalyticsResult;
  } catch (error: any) {
    console.error("Error calling predictive analytics backend:", error);
    throw new Error(`The AI assistant could not predict the outcome. Details: ${error.message}`);
  }
}

// FIX: Update performSmartConflictCheck to call the new external Flask API endpoint.
// This replaces the previous Supabase Edge Function implementation.
export async function performSmartConflictCheck(
  clientName: string,
  opposingParties: string,
  matterSummary: string,
): Promise<Conflict[]> {
  // Add input validation for robustness and clear user feedback.
  if (!clientName || typeof clientName !== 'string' || clientName.trim().length === 0) {
    throw new Error("A client name is required to perform a conflict check.");
  }
  // An empty opposing parties string is valid, but the matter summary is essential for a useful check.
  if (!matterSummary || typeof matterSummary !== 'string' || matterSummary.trim().length < 5) {
    throw new Error("A matter summary of at least 5 characters is required for an effective conflict check.");
  }

  try {
    const response = await fetch(SMART_CONFLICT_CHECK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_name: clientName.trim(),
        // Ensure opposing_parties is always a string, even if empty.
        opposing_parties: (opposingParties || '').trim(),
        matter_summary: matterSummary.trim(),
      }),
    });

    if (!response.ok) {
      let errorMsg = `Conflict check service failed with status ${response.status}.`;
      try {
        const errorData = await response.json();
        // Use the API's error message if available
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        // Response was not JSON, stick with the generic status error.
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();

    // Handle cases where the API returns a malformed response.
    if (!data || !Array.isArray(data.conflicts)) {
      throw new Error("The conflict check service returned an unexpected response format.");
    }
    
    return data.conflicts as Conflict[];
  } catch (error: any) {
    console.error("Error calling smart conflict check backend:", error);
    // Re-throw our validation errors directly as they are user-friendly.
    if (error.message.includes("is required")) {
        throw error;
    }
    // Wrap other errors for the user.
    throw new Error(`The AI assistant could not perform the conflict check. Details: ${error.message}`);
  }
}