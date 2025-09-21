import React, { useState, useMemo } from 'react';
import { I9Record, Page, UserProfile } from '../types';
import ErrorAlert from './ErrorAlert';

interface I9WorkFlowPageProps {
    i9Record: I9Record;
    user: UserProfile;
    onUpdate: (record: I9Record) => Promise<I9Record>;
    onSubmitToEVerify: (record: I9Record) => Promise<void>;
    onNavigate: (page: Page) => void;
}

const LoadingSpinner: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">{text}</p>
    </div>
);

const I9WorkFlowPage: React.FC<I9WorkFlowPageProps> = ({ i9Record, user, onUpdate, onSubmitToEVerify, onNavigate }) => {
    const [formData, setFormData] = useState<any>(i9Record.section1_data || {});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBack = () => onNavigate('i9Compliance');

    const handleUpdate = async (newStatus: string, section: 'section1_data' | 'section2_data', data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedRecord: I9Record = {
                ...i9Record,
                status: newStatus,
                employee_name: data.fullName || i9Record.employee_name, // Capture name for dashboard
                [section]: data
            };
            await onUpdate(updatedRecord);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save section.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEVerifySubmit = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await onSubmitToEVerify(i9Record);
        } catch (e) {
            setError(e instanceof Error ? e.message : "E-Verify submission failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const eVerifyCase = useMemo(() => user.eVerifyCases.find(c => c.i9_record_id === i9Record.id), [user.eVerifyCases, i9Record.id]);

    const renderContent = () => {
        if (isLoading) return <LoadingSpinner text="Processing..." />;

        switch (i9Record.status) {
            case 'awaiting_employee':
                return <Section1Form initialData={i9Record.section1_data as any} onSave={(data) => handleUpdate('awaiting_employer', 'section1_data', data)} />;
            case 'awaiting_employer':
                return <Section2Form section1Data={i9Record.section1_data as any} initialData={i9Record.section2_data as any} onSave={(data) => handleUpdate('pending_e_verify', 'section2_data', data)} />;
            case 'pending_e_verify':
                return <EVerifySubmission onEVerifySubmit={handleEVerifySubmit} />;
            case 'e_verify_authorized':
            case 'e_verify_tnc':
                if (!eVerifyCase) return <div>Loading E-Verify status...</div>;
                return <EVerifyStatusDisplay eVerifyCase={eVerifyCase} />;
            default:
                return <div>Unknown status. Please go back.</div>;
        }
    };

    return (
        <div>
            <button onClick={handleBack} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mb-2">
                &larr; Back to I-9 Dashboard
            </button>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Form I-9 & E-Verify Workflow</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
                For Employee: {i9Record.employee_name || 'Not yet specified'}
            </p>
            <div className="mt-6 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                {error && <div className="mb-4"><ErrorAlert message={error} /></div>}
                {renderContent()}
            </div>
        </div>
    );
};


// --- Sub-Components for each step ---

const Section1Form: React.FC<{ initialData: any, onSave: (data: any) => void }> = ({ initialData, onSave }) => {
    const [data, setData] = useState(initialData || { attestation: 'citizen' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setData({ ...data, [e.target.name]: e.target.value });
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(data); }} className="space-y-4">
            <h2 className="text-xl font-bold">Section 1: Employee Information and Attestation</h2>
            {/* Simplified form for demo */}
            <InputField label="Full Name" name="fullName" value={data.fullName || ''} onChange={handleChange} required />
            <InputField label="Address" name="address" value={data.address || ''} onChange={handleChange} required />
            <InputField label="Date of Birth" name="dob" type="date" value={data.dob || ''} onChange={handleChange} required />
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Attestation of status</label>
                <select name="attestation" value={data.attestation} onChange={handleChange} className="w-full input-field">
                    <option value="citizen">A citizen of the United States</option>
                    <option value="noncitizen_national">A noncitizen national of the United States</option>
                    <option value="lpr">A lawful permanent resident</option>
                    <option value="alien_authorized">An alien authorized to work</option>
                </select>
            </div>
            <InputField label="Electronic Signature (Type Full Name)" name="signature" value={data.signature || ''} onChange={handleChange} required />
            <button type="submit" className="w-full btn-primary">Save and Continue to Section 2</button>
        </form>
    );
};

const Section2Form: React.FC<{ section1Data: any, initialData: any, onSave: (data: any) => void }> = ({ section1Data, initialData, onSave }) => {
    const [data, setData] = useState(initialData || { docType: 'passport' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setData({ ...data, [e.target.name]: e.target.value });
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(data); }} className="space-y-4">
            <h2 className="text-xl font-bold">Section 2: Employer Review and Verification</h2>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                <h3 className="font-semibold">Employee Info from Section 1</h3>
                <p><strong>Name:</strong> {section1Data.fullName}</p>
                <p><strong>Attestation:</strong> {section1Data.attestation}</p>
            </div>
            {/* Simplified form for demo */}
            <InputField label="Document Title (List A)" name="docTitle" value={data.docTitle || 'U.S. Passport'} onChange={handleChange} required />
            <InputField label="Issuing Authority" name="issuingAuthority" value={data.issuingAuthority || 'U.S. Department of State'} onChange={handleChange} required />
            <InputField label="Document Number" name="docNumber" value={data.docNumber || ''} onChange={handleChange} required />
            <InputField label="Expiration Date" name="expDate" type="date" value={data.expDate || ''} onChange={handleChange} />
            <InputField label="Employer Signature (Type Full Name)" name="employerSignature" value={data.employerSignature || ''} onChange={handleChange} required />
            <button type="submit" className="w-full btn-primary">Complete I-9 and Proceed to E-Verify</button>
        </form>
    );
};

const EVerifySubmission: React.FC<{ onEVerifySubmit: () => void }> = ({ onEVerifySubmit }) => (
    <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Form I-9 Complete</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">The employee and employer sections of the Form I-9 have been completed. The next step is to submit the employee's information to E-Verify.</p>
        <button onClick={onEVerifySubmit} className="mt-6 btn-primary px-8 py-3 text-lg">
            Submit to E-Verify
        </button>
    </div>
);

const EVerifyStatusDisplay: React.FC<{ eVerifyCase: any }> = ({ eVerifyCase }) => {
    const isAuthorized = eVerifyCase.status === 'Employment Authorized';
    return (
        <div className="text-center p-8">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${isAuthorized ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    {isAuthorized ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />}
                </svg>
            </div>
            <h2 className={`text-2xl font-bold mt-4 ${isAuthorized ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>{eVerifyCase.status}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Case Number: <strong>{eVerifyCase.case_number}</strong></p>
            <p className="text-sm text-slate-400">Resolved on {new Date(eVerifyCase.resolved_at).toLocaleString()}</p>
        </div>
    );
};

// --- Shared Components ---
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <input
      id={props.name}
      {...props}
      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);
const style = document.createElement('style');
style.innerHTML = `
    .input-field {
        padding: 0.5rem 0.75rem; border-width: 1px; border-radius: 0.375rem;
        background-color: white; border-color: #cbd5e1;
    }
    .dark .input-field { background-color: #334155; border-color: #475569; }
    .btn-primary { 
        padding: 0.75rem 1rem; border: 1px solid transparent; border-radius: 0.375rem;
        font-weight: 500; color: white; background-color: #2563eb;
    }
    .btn-primary:hover { background-color: #1d4ed8; }
    .btn-primary:disabled { background-color: #94a3b8; }
`;
document.head.appendChild(style);


export default I9WorkFlowPage;