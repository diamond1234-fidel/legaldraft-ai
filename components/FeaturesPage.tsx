import React from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';
import PencilIcon from './icons/PencilIcon';
import EyeIcon from './icons/EyeIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import SearchIcon from './icons/SearchIcon';
import TasksIcon from './icons/TasksIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';

const FeaturesPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    return (
        <div className="bg-white dark:bg-slate-900">
            <PublicHeader onNavigate={onNavigate} currentPage="features" />
            <main>
                <HeroSection onNavigate={onNavigate} />
                <FeaturesGridSection />
                <WorkflowSection />
                <TestimonialSection />
                <FAQSection />
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
                The All-In-One Platform to Run Your Law Practice
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                Stop juggling tools. Start practicing law. LegalDraft AI centralizes your cases, documents, and research into one intelligent platform.
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
        { icon: <PencilIcon className="w-6 h-6" />, title: "AI-Powered Drafting", description: "Generate robust, state-specific legal documents from simple prompts in minutes, not hours." },
        { icon: <EyeIcon className="w-6 h-6" />, title: "AI Document Review", description: "Instantly analyze incoming contracts for risks, ambiguities, and non-market terms." },
        { icon: <BriefcaseIcon className="w-6 h-6" />, title: "Unified Case Management", description: "A single source of truth for your entire practice. Manage clients, matters, and notes effortlessly." },
        { icon: <SearchIcon className="w-6 h-6" />, title: "Advanced Legal Research", description: "Find and analyze relevant case law, assess argument strength, and build a stronger case strategy." },
        { icon: <TasksIcon className="w-6 h-6" />, title: "Task & Deadline Tracking", description: "Create and assign tasks for every matter. See upcoming deadlines at a glance and never miss a date." },
        { icon: <ShieldCheckIcon className="w-6 h-6" />, title: "Smart Conflict Checks", description: "Automatically screen new clients and matters against your firm's historical data to avoid ethical pitfalls." }
    ];

    return (
        <section className="py-20 md:py-28 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">A Smarter Way to Work</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        LegalDraft AI is more than just a tool—it's a comprehensive operating system for your firm, designed to amplify your expertise and streamline your workflow.
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

const WorkflowSection: React.FC = () => {
    const steps = [
        { title: "Start a Matter", description: "Use our streamlined intake tools to create a new client and matter file in minutes." },
        { title: "Draft & Analyze", description: "Leverage AI to generate compliant documents from scratch or analyze incoming contracts for risks." },
        { title: "Manage & Collaborate", description: "Track tasks, add notes, and store all case-related documents securely in one place." },
        { title: "Research & Strategize", description: "Use advanced AI research tools to find precedents and build your strongest case." }
    ];

    return (
        <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900/70">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Your Workflow, Supercharged</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        Integrate powerful AI into your daily practice with a simple, intuitive workflow.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    {steps.map((step, index) => (
                        <div key={step.title} className="relative pl-8">
                            <div className="absolute left-0 top-0 text-4xl font-bold text-blue-200 dark:text-slate-700">0{index + 1}</div>
                            <h3 className="mt-1 font-bold text-lg text-slate-800 dark:text-slate-100">{step.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const TestimonialSection: React.FC = () => (
    <section className="py-20 md:py-28 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
            <figure className="max-w-4xl mx-auto text-center">
                <blockquote>
                    <p className="text-2xl md:text-3xl font-medium text-slate-800 dark:text-slate-100">
                        “The AI drafter reduced our initial contract creation time by over 70%. The state-specific clauses were spot-on, making it an indispensable tool for our firm.”
                    </p>
                </blockquote>
                <figcaption className="mt-6">
                    <div className="text-base text-slate-600 dark:text-slate-300 font-semibold">Jane Doe</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Partner, Doe & Smith LLC</div>
                </figcaption>
            </figure>
        </div>
    </section>
);

const FAQSection: React.FC = () => {
    const faqs = [
        { q: "Is my data secure and confidential?", a: "Absolutely. We use industry-standard encryption for data in transit and at rest. Your confidential client and case data is never used to train our AI models." },
        { q: "Can LegalDraft AI replace a paralegal or junior associate?", a: "Our platform is designed to be a powerful assistant, not a replacement. It automates repetitive tasks, allowing legal professionals to focus on high-level strategy, client relationships, and complex legal analysis." },
        { q: "What jurisdictions do you support?", a: "Our AI is trained on a vast corpus of US law and can generate documents compliant with the laws of all 50 states. Our case law research database also covers federal and state courts." },
        { q: "Does the platform integrate with other software?", a: "Yes, our 'Firm' and 'Enterprise' plans offer integrations with popular legal and business software, including Clio, PracticePanther, and Microsoft 365. API access is available for custom integrations." }
    ];

    return (
        <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900/70">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100">Frequently Asked Questions</h2>
                <div className="mt-8 space-y-4">
                    {faqs.map((faq, index) => (
                        <details key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer group" open={index === 0}>
                            <summary className="font-semibold text-slate-800 dark:text-slate-200 flex justify-between items-center list-none">
                                {faq.q}
                                <div className="ml-4 transition-transform transform group-open:rotate-180">
                                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </summary>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">{faq.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FinalCTASection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold text-white">Ready to Elevate Your Practice?</h2>
            <p className="text-lg text-blue-200 mt-2">Start your free 14-day trial and experience the future of legal work. No credit card required.</p>
            <button onClick={() => onNavigate('signup')} className="mt-8 px-8 py-3 font-semibold text-blue-600 bg-white rounded-lg hover:bg-slate-100 transition-transform hover:scale-105 shadow-2xl">
                Start My Free Trial
            </button>
        </div>
    </section>
);

export default FeaturesPage;
