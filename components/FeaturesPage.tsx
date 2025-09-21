import React from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';
import EyeIcon from './icons/EyeIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import SearchIcon from './icons/SearchIcon';
import SparklesIcon from './icons/SparklesIcon';


const FeaturesPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    return (
        <div className="bg-white dark:bg-slate-900">
            <PublicHeader onNavigate={onNavigate} currentPage="features" />
            <main>
                <HeroSection onNavigate={onNavigate} />
                <FeaturesGridSection />
                <UseCasesSection />
                <FinalCTASection onNavigate={onNavigate} />
            </main>
        </div>
    );
};

const HeroSection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="relative text-center py-20 md:py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tighter">
                Features Designed to Give You an Edge
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                From instant summaries to deep-dive risk analysis, our platform provides the tools you need to understand and improve any legal document.
            </p>
            <div className="mt-8 flex justify-center">
                <button 
                    onClick={() => onNavigate('signup')} 
                    className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105 shadow-lg"
                >
                    Start Your Free Trial
                </button>
            </div>
        </div>
    </section>
);

const FeaturesGridSection: React.FC = () => {
    const features = [
        { icon: <EyeIcon className="w-6 h-6" />, title: "Instant AI Summary", description: "Get a concise, easy-to-understand summary of any contract in seconds, highlighting its core purpose and key terms." },
        { icon: <ShieldCheckIcon className="w-6 h-6" />, title: "Risk & Red Flag Detection", description: "Our AI automatically scans for one-sided clauses, ambiguous language, and potential liabilities, rating each by severity (High, Medium, Low)." },
        { icon: <SearchIcon className="w-6 h-6" />, title: "Missing Clause Analysis", description: "Ensure your contracts are comprehensive. We check for common but critical missing clauses like Indemnification, Confidentiality, and more." },
        { icon: <SparklesIcon className="w-6 h-6" />, title: "Plain-Language Suggestions", description: "Receive clear, actionable suggestions to improve confusing language, close loopholes, and strengthen your legal position." },
        { icon: <DocumentIcon className="w-6 h-6" />, title: "Multi-Format Support", description: "Upload contracts in PDF, DOCX, or TXT format. Our text extraction handles various layouts and even scanned documents." },
        { icon: <FolderIcon className="w-6 h-6" />, title: "Downloadable Reports", description: "Export the complete AI analysis into a clean, professional PDF or Word document to share with colleagues or clients." },
    ];

    return (
        <section className="py-20 md:py-28 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">An Entirely New Way to Review Documents</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-3xl mx-auto">
                        Our platform is more than just a tool—it's your AI-powered legal assistant.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {features.map(feature => (
                        <div key={feature.title} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 dark:bg-slate-700 dark:text-blue-400 rounded-lg flex items-center justify-center">{feature.icon}</div>
                            <h3 className="mt-4 font-bold text-lg text-slate-800 dark:text-slate-100">{feature.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const UseCasesSection: React.FC = () => (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/70">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Perfect For...</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <UseCaseCard title="Founders & Startups" description="Quickly review vendor agreements, SaaS terms, and NDAs to understand your obligations without immediate legal overhead." />
                <UseCaseCard title="Solo & Small Firms" description="Level the playing field. Get a second, AI-powered opinion on complex contracts to better serve your clients." />
                <UseCaseCard title="In-House Counsel" description="Accelerate your contract review workflow. Triage inbound contracts faster and focus your time on high-stakes negotiation." />
            </div>
        </div>
    </section>
);

const UseCaseCard: React.FC<{title: string, description: string}> = ({title, description}) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-lg">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">{description}</p>
    </div>
);


const FinalCTASection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold text-white">Ready to Analyze Your First Contract?</h2>
            <p className="text-lg text-blue-200 mt-2">Sign up and get 5 free analyses to see the power of AI in action. No credit card required.</p>
            <button onClick={() => onNavigate('signup')} className="mt-8 px-8 py-3 font-semibold text-blue-600 bg-white rounded-lg hover:bg-slate-100 transition-transform hover:scale-105 shadow-2xl">
                Start for Free
            </button>
        </div>
    </section>
);

// Dummy icons for this page
const DocumentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const FolderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
  </svg>
);


export default FeaturesPage;