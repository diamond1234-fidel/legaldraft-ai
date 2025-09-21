
import { Signatory, DocumentStatus, Json } from '../types';
import { supabase } from './supabaseClient';


/**
 * Mocks sending a document for signature by creating a request in the database.
 */
export const sendForSignature = async (
    documentContent: string,
    signatories: Omit<Signatory, 'status'>[],
    documentId: string,
    userId: string,
): Promise<{ signatureRequestId: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency

    if (documentContent.length < 10) {
        throw new Error("Document content is too short to be sent for signature.");
    }
    
    const signatureRequestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { error } = await supabase.from('signature_requests').insert({
        id: signatureRequestId,
        user_id: userId,
        document_id: documentId,
        signatories: signatories.map(s => ({ ...s, status: 'pending' })) as unknown as Json,
        overall_status: 'out_for_signature',
    });

    if (error) {
        console.error("Error creating signature request:", error);
        throw new Error(`Failed to create signature request in database: ${error.message}`);
    }
    
    return { signatureRequestId };
};

/**
 * Mocks checking the status of a signature request.
 * This function will randomly "sign" documents over time to simulate a real process.
 */
export const getSignatureStatus = async (
    signatureRequestId: string
): Promise<{ status: DocumentStatus; signatories: Signatory[] }> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency

    const { data: request, error } = await supabase
        .from('signature_requests')
        .select('*')
        .eq('id', signatureRequestId)
        .single();

    if (error || !request) {
        throw new Error("Signature request not found. It may have been cleared from the demo's local storage or failed to be created.");
    }
    
    // Simulate a signatory signing the document
    const signatories = (request.signatories as unknown as Signatory[]) || [];
    const pendingSignatories = signatories.filter(s => s.status === 'pending');
    if (pendingSignatories.length > 0) {
        // Randomly decide if someone signs (higher chance to make demo quicker)
        if (Math.random() > 0.4) {
            const signatoryToSign = pendingSignatories[0];
            signatoryToSign.status = 'signed';
        }
    }

    // Update overall status if all have signed
    const allSigned = signatories.every(s => s.status === 'signed');
    const newStatus = allSigned ? 'signed' : request.overall_status;
    
    // Update DB
    if (newStatus !== request.overall_status || JSON.stringify(signatories) !== JSON.stringify(request.signatories)) {
         const { error: updateError } = await supabase
            .from('signature_requests')
            .update({ signatories: signatories as unknown as Json, overall_status: newStatus })
            .eq('id', signatureRequestId);

        if (updateError) {
            console.error("Error updating signature status:", updateError);
            throw new Error(`Failed to update signature status: ${updateError.message}`);
        }
    }

    return {
        status: newStatus as DocumentStatus,
        signatories: signatories,
    };
};
