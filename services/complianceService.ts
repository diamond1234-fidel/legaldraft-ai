
export type EVerifyResult = 'Employment Authorized' | 'Tentative Nonconfirmation (TNC)' | 'Final Nonconfirmation';

export interface EVerifyResponse {
    caseNumber: string;
    status: EVerifyResult;
    submittedAt: string;
    resolvedAt: string;
}

/**
 * Simulates a submission to the E-Verify system.
 * In a real application, this would be a secure backend API call to the DHS E-Verify system.
 * This simulation provides a realistic user experience for the demo.
 * @param employeeName The name of the employee from the I-9 form.
 * @returns A promise that resolves with the E-Verify case result.
 */
export const simulateEVerifySubmission = async (employeeName: string): Promise<EVerifyResponse> => {
    console.log(`Simulating E-Verify submission for: ${employeeName}`);
    
    // Simulate network latency and processing time (e.g., 2-5 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    const caseNumber = `EV-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const submittedAt = new Date().toISOString();
    let status: EVerifyResult = 'Employment Authorized';

    // Introduce variability for demonstration purposes
    const lowerCaseName = employeeName.toLowerCase();
    if (lowerCaseName.includes('tnc') || lowerCaseName.includes('error')) {
        status = 'Tentative Nonconfirmation (TNC)';
    } else if (Math.random() < 0.05) { // 5% chance of a random TNC
        status = 'Tentative Nonconfirmation (TNC)';
    }
    
    const resolvedAt = new Date().toISOString();

    console.log(`E-Verify simulation result for ${caseNumber}: ${status}`);

    return {
        caseNumber,
        status,
        submittedAt,
        resolvedAt,
    };
};
