import { ResearchParams, ResearchResults, ResearchType } from '../types';

// --- MOCK DATA ---

const MOCK_PUBLIC_PROFILE = {
    fullName: "Jane Doe",
    title: "General Counsel",
    company: "Innovate Corp",
    location: "San Francisco, CA",
    linkedinUrl: "https://www.linkedin.com/in/janedoe-example",
    companyDomain: "innovatecorp.com"
};

const MOCK_IMAGE_RESULTS = [
    { source: "Innovate Corp Website", url: "https://innovatecorp.com/about", snippet: "...Jane Doe, our General Counsel, leads the legal team...", thumbnailUrl: "https://via.placeholder.com/150/8f8f8f/ffffff?text=Corp+Site" },
    { source: "Tech Conference Panel", url: "https://techconference.com/speakers", snippet: "Featuring Jane Doe on the future of AI in law.", thumbnailUrl: "https://via.placeholder.com/150/cccccc/000000?text=Conference" },
];

const MOCK_COURT_FILINGS = [
    { docketNumber: "3:2023-cv-01234", caseTitle: "Innovate Corp v. Alpha Tech", jurisdiction: "N.D. Cal.", link: "#" },
    { docketNumber: "CGC-22-555678", caseTitle: "Smith v. Innovate Corp", jurisdiction: "San Francisco Superior Court", link: "#" },
];

const MOCK_KYC_RESULT = {
    status: "verified",
    verificationId: "iden_1M3xYz2eZvKYlo2CuzbA4fB3",
    checkedAt: new Date().toISOString()
};

// --- MOCK API SERVICE ---

/**
 * Simulates calling various research APIs based on the research type.
 * @param params The research parameters from the user.
 * @returns A promise that resolves with the structured research results.
 */
export async function performResearch(params: ResearchParams): Promise<ResearchResults> {
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate API errors based on input
    if (params.fullName.toLowerCase().includes("error")) {
        throw new Error("Simulated API error: The third-party service is currently unavailable.");
    }
    if (!params.consentGiven) {
        throw new Error("Lawful basis consent is required to perform a search.");
    }
    
    const results: ResearchResults = {};

    switch(params.researchType) {
        case 'publicProfile':
            results.publicProfile = MOCK_PUBLIC_PROFILE;
            break;
        case 'reverseImage':
            results.imageResults = MOCK_IMAGE_RESULTS;
            break;
        case 'courtFilings':
            results.courtFilings = MOCK_COURT_FILINGS;
            break;
        case 'kyc':
            results.kyc = MOCK_KYC_RESULT;
            break;
        default:
            // Default to returning a bit of everything if no type is specified
            results.publicProfile = MOCK_PUBLIC_PROFILE;
            results.courtFilings = MOCK_COURT_FILINGS;
            break;
    }

    return results;
}