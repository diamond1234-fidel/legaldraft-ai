
import React, { useState, useEffect } from 'react';
import { Page, Document, USCISFormQuestionnaire, USCISFormResult } from '../types';
import { USCIS_FORMS } from '../constants';
import ErrorAlert from './ErrorAlert';
import { generateAndCheckUSCISForm } from '../services/geminiService';
import { fillUSCISForm } from '../services/pdfService';
import I864Questionnaire from './questionnaires/I864Questionnaire';
import GenericQuestionnaire from './questionnaires/GenericQuestionnaire';
import I130Questionnaire from './questionnaires/I130Questionnaire';
import I485Questionnaire from './questionnaires/I485Questionnaire';
import N400Questionnaire from './questionnaires/N400Questionnaire';
import G28Questionnaire from './questionnaires/G28Questionnaire';
import I129FQuestionnaire from './questionnaires/I129FQuestionnaire';
import I751Questionnaire from './questionnaires/I751Questionnaire';
import I765Questionnaire from './questionnaires/I765Questionnaire';
import N600Questionnaire from './questionnaires/N600Questionnaire';
import I129Questionnaire from './questionnaires/I129Questionnaire';
import I140Questionnaire from './questionnaires/I140Questionnaire';
import I589Questionnaire from './questionnaires/I589Questionnaire';
import I824Questionnaire from './questionnaires/I824Questionnaire';
import I131Questionnaire from './questionnaires/I131Questionnaire';
import N600KQuestionnaire from './questionnaires/N600KQuestionnaire';
import I907Questionnaire from './questionnaires/I907Questionnaire';
import I730Questionnaire from './questionnaires/I730Questionnaire';
import I9Questionnaire from './questionnaires/I9Questionnaire';
import I290BQuestionnaire from './questionnaires/I290BQuestionnaire';
import I601Questionnaire from './questionnaires/I601Questionnaire';
import I212Questionnaire from './questionnaires/I212Questionnaire';


interface FormFillingPageProps {
    onNavigate: (page: Page) => void;
    // FIX: Corrected the Omit type for addDocument to align with its definition in App.tsx.
    addDocument: (docData: Omit<Document, 'id' | 'created_at' | 'user_id' | 'version_history'>) => Promise<Document>;
}

const LoadingState: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">Generating Form & Checking for Errors...</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">The AI is filling the form and performing a compliance check.</p>
    </div>
);

const FormFillingPage: React.FC<FormFillingPageProps> = ({ onNavigate, addDocument }) => {
    const [formId, setFormId] = useState<string | null>(null);
    const [questionnaireData, setQuestionnaireData] = useState<USCISFormQuestionnaire>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<USCISFormResult | null>(null);

    useEffect(() => {
        const selectedId = sessionStorage.getItem('selectedFormId');
        if (selectedId) {
            setFormId(selectedId);
            // Initialize form data based on ID
            let initialData: USCISFormQuestionnaire = {};
            switch(selectedId) {
                 case 'i-130':
                    initialData = { petitionerFullName: '', petitionerAddress: '', petitionerDob: '', petitionerPob: '', petitionerSsn: '', petitionerStatus: 'U.S. Citizen', petitionerEmployer: '', beneficiaryFullName: '', beneficiaryAddress: '', beneficiaryDob: '', beneficiaryPob: '', beneficiaryANumber: '', beneficiaryMaritalStatus: '', relationship: '', dateOfMarriage: '', placeOfMarriage: '', priorPetitions: '' };
                    break;
                case 'i-485':
                    initialData = { applicantFullName: '', applicantDob: '', applicantPob: '', applicantANumber: '', applicantSsn: '', i94Number: '', currentStatus: '', travelHistory: '', employmentHistory: '', crimeHistory: '', terrorist: '' };
                    break;
                case 'i-129f':
                    initialData = { petitionerName: '', petitionerDob: '', petitionerAddress: '', petitionerCitizenship: 'U.S. Citizen', beneficiaryName: '', beneficiaryDob: '', beneficiaryAddress: '', beneficiaryNationality: '', metInPerson: false, engagementDate: '', priorMarriages: '', intendedMarriageDetails: '' };
                    break;
                case 'i-824':
                    initialData = { applicantName: '', applicantANumber: '', applicantDob: '', approvedPetitionReceipt: '', approvedPetitionFormType: '', actionRequested: 'duplicate_notice' };
                    break;
                case 'i-751':
                    initialData = { residentFullName: '', residentDob: '', residentANumber: '', residentAddress: '', spouseFullName: '', marriageDate: '', cohabitationProof: '', childrenInfo: '', jointFiling: true, divorceExplanation: '', abuseExplanation: '', hardshipExplanation: '' };
                    break;
                case 'i-765':
                    initialData = { applicantName: '', applicantDob: '', applicantPob: '', applicantANumber: '', applicantSsn: '', currentStatus: '', eligibilityCategory: 'c9', priorEad: '', mailingAddress: '' };
                    break;
                case 'i-131':
                    initialData = { applicantName: '', applicantDob: '', applicantANumber: '', applicantAddress: '', currentStatus: '', reasonForTravel: 'advance_parole', travelHistory: '', plannedTrips: '', emergencyContact: '' };
                    break;
                case 'n-400':
                     initialData = { n400FullName: '', n400Dob: '', n400ANumber: '', n400AddressHistory: '', n400EmploymentHistory: '', n400TravelHistory: '', n400MaritalStatus: '', n400Children: 0 };
                    break;
                case 'n-600':
                    initialData = { applicantName: '', applicantDob: '', applicantANumber: '', parent1Name: '', parent1Citizenship: '', parent1Dob: '', parent2Name: '', parent2Citizenship: '', parent2Dob: '', relationship: '', immigrationHistory: '', lprEvidence: '' };
                    break;
                case 'n-600k':
                    initialData = { applicantName: '', applicantDob: '', applicantANumber: '', parent1Name: '', parent1Citizenship: '', parent1Dob: '', uscParentResidenceHistory: '', childResidenceAbroad: '', intendedUSCustody: '' };
                    break;
                case 'i-129':
                    initialData = { employerName: '', employerAddress: '', employerFein: '', jobTitle: '', jobDuties: '', salary: '', location: '', workerName: '', workerDob: '', workerNationality: '', workerPassport: '', workerI94: '', workerPriorStatus: '' };
                    break;
                case 'i-140':
                    initialData = { employerName: '', employerFein: '', jobTitle: '', jobDuties: '', offeredWage: '', beneficiaryName: '', beneficiaryDob: '', qualifications: '', laborCertInfo: '' };
                    break;
                case 'i-907':
                    initialData = { referencePetitionReceipt: '', employerName: '', beneficiaryName: '' };
                    break;
                case 'i-589':
                    initialData = { applicantName: '', applicantDob: '', applicantNationality: '', applicantANumber: '', addressHistory: '', familyInfo: '', immigrationHistory: '', asylumBasis: '', criminalHistory: '' };
                    break;
                case 'i-730':
                    initialData = { petitionerName: '', petitionerANumber: '', petitionerStatus: 'Asylee', beneficiaryName: '', beneficiaryDob: '', relationship: '', relationshipProof: '' };
                    break;
                case 'i-9':
                    initialData = { employeeName: '', employeeDob: '', employeeSsn: '', employeeAddress: '', employeeImmigrationStatus: 'citizen' };
                    break;
                case 'i-290b':
                    initialData = { applicantName: '', applicantANumber: '', deniedApplicationReceipt: '', deniedApplicationFormType: '', groundsForAppeal: '' };
                    break;
                case 'i-601':
                case 'i-601a':
                     initialData = { applicantName: '', applicantDob: '', applicantANumber: '', basisOfInadmissibility: '', qualifyingRelativeInfo: '', hardshipEvidence: '' };
                    break;
                case 'i-212':
                    initialData = { applicantName: '', applicantANumber: '', deportationHistory: '', groundsForReentry: '' };
                    break;
                case 'g-28':
                    initialData = { attorneyName: '', attorneyBar: '', attorneyAddress: '', clientName: '', clientANumber: '', clientDob: '', attorneySignature: false, clientSignature: false };
                    break;
                case 'i-864':
                    initialData = { sponsorFullName: '', sponsorMailingAddress: '', sponsorPhysicalAddress: '', sponsorDob: '', sponsorPob: '', sponsorStatus: 'U.S. Citizen', sponsorSsn: '', sponsorEmployer: '', maritalStatus: '', householdSize: 1, annualIncome: '', agi1: '', agi2: '', agi3: '', assets: '', immigrantFullName: '', relationship: '', certification: false };
                    break;
                default:
                    initialData = { petitionerFullName: '', petitionerAddress: '', beneficiaryFullName: '', beneficiaryDOB: '', dateOfMarriage: '' };
                    break;
            }
            setQuestionnaireData(initialData);
        } else {
            onNavigate('forms');
        }
    }, [onNavigate]);

    const formInfo = USCIS_FORMS.find(f => f.id === formId);

    const handleGenerate = async () => {
        if (!formInfo) return;
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const apiResult = await generateAndCheckUSCISForm(formInfo.name, questionnaireData);
            setResult(apiResult);
            
            const primaryName = 
                questionnaireData.beneficiaryFullName || 
                questionnaireData.immigrantFullName || 
                questionnaireData.applicantFullName ||
                questionnaireData.applicantName ||
                questionnaireData.workerName ||
                questionnaireData.beneficiaryName ||
                questionnaireData.residentFullName ||
                questionnaireData.n400FullName || 
                'Beneficiary';

            const content = `## AI-Generated Summary for ${formInfo.name}\n\n### Form Data:\n\`\`\`json\n${JSON.stringify(apiResult.filledData, null, 2)}\n\`\`\`\n\n### Errors & Warnings:\n${apiResult.errorsAndWarnings.length > 0 ? apiResult.errorsAndWarnings.map(e => `- ${e}`).join('\n') : 'None found.'}`;
            
            // FIX: Added all missing nullable properties to satisfy the Document type from App.tsx.
            await addDocument({
                name: `Generated ${formInfo.name} for ${primaryName}`,
                type: 'Automated USCIS Form',
                state: 'USA-Federal',
                status: 'draft',
                content,
                source: 'generated',
                file_url: null,
                matter_id: null,
                signature_request_id: null,
                health_score: null,
                signatories: null,
                feedback_comment: null,
                feedback_is_useful: null,
            });

        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = async () => {
        if (!result || !formInfo) return;
        setIsDownloading(true);
        setError(null);
        try {
            await fillUSCISForm(formInfo.id, result.filledData);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to generate PDF. The form template may be unavailable or the field mapping is not yet configured for this form.");
        } finally {
            setIsDownloading(false);
        }
    };

    const renderQuestionnaire = () => {
        switch (formId) {
            case 'i-130': return <I130Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-485': return <I485Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-129f': return <I129FQuestionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-824': return <I824Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-751': return <I751Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-765': return <I765Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-131': return <I131Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'n-400': return <N400Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'n-600': return <N600Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'n-600k': return <N600KQuestionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-129': return <I129Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-140': return <I140Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-907': return <I907Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-589': return <I589Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-730': return <I730Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-9': return <I9Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-290b': return <I290BQuestionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-601':
            case 'i-601a':
                return <I601Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-212': return <I212Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'g-28': return <G28Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            case 'i-864': return <I864Questionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
            default:
                return <GenericQuestionnaire data={questionnaireData} onDataChange={setQuestionnaireData} />;
        }
    };


    if (!formInfo) {
        return <div>Loading form...</div>;
    }
    
    if (result) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Generated Form & Compliance Check</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Review the AI-generated results and flagged issues for {formInfo.name}.</p>
                
                {error && <div className="my-4"><ErrorAlert message={error} /></div>}

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Compliance Check Results</h2>
                    {result.errorsAndWarnings.length > 0 ? (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 rounded-lg space-y-2">
                           <h3 className="font-bold text-yellow-800 dark:text-yellow-200">Potential Issues Found:</h3>
                           <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300">
                                {result.errorsAndWarnings.map((item, index) => <li key={index}>{item}</li>)}
                           </ul>
                        </div>
                    ) : (
                         <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50 rounded-lg">
                             <h3 className="font-bold text-green-800 dark:text-green-200">No Potential Issues Found</h3>
                             <p className="text-sm text-green-700 dark:text-green-300">The AI assistant did not find any common errors in the provided data. Please review manually before filing.</p>
                         </div>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Filled Form Data (JSON Preview)</h2>
                     <pre className="text-xs bg-slate-100 dark:bg-slate-900/50 p-4 rounded-md max-h-96 overflow-auto"><code>{JSON.stringify(result.filledData, null, 2)}</code></pre>
                </div>
                
                 <div className="flex justify-end gap-2">
                    <button onClick={() => setResult(null)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200">Edit Questionnaire</button>
                    <button onClick={handleDownload} disabled={isDownloading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-400">
                        {isDownloading ? 'Downloading...' : 'Download Filled PDF'}
                    </button>
                </div>

            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{formInfo.name}</h1>
                <p className="text-slate-600 dark:text-slate-400 -mt-4">{formInfo.title}</p>
                <p className="text-sm text-slate-500">Fill in the details below. The AI will use this information to populate the form and perform a compliance check for common errors.</p>
                
                {error && <ErrorAlert message={error} />}

                {renderQuestionnaire()}

                <button onClick={handleGenerate} disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400">
                    {isLoading ? 'Generating...' : 'Generate & Check for Errors'}
                </button>
            </div>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[500px]">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-6">Generated Results</h2>
                {isLoading ? <LoadingState /> : (
                     <div className="flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 h-full p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p>Your generated form summary and compliance check will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormFillingPage;