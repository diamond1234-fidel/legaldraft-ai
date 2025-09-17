import React from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';
import SignatureIcon from './icons/SignatureIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import SupportIcon from './icons/SupportIcon';
import TemplateIcon from './icons/TemplateIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import PencilIcon from './icons/PencilIcon';
import MailIcon from './icons/MailIcon';


interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

// --- SVG Icon Components ---
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const QuoteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="41" height="34" viewBox="0 0 41 34" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.64 33.09C8.91 33.09 6.555 32.31 4.575 30.75C2.595 29.19 1.1325 27.27 0.1875 25C-0.7575 22.73 -0.5625 20.37 -0.1875 17.925C0.1875 15.48 1.1325 12.33 2.6475 8.475L8.1675 0.625H16.1175L11.52 14.715C13.59 15.225 15.15 16.29 16.2 17.91C17.25 19.53 17.775 21.375 17.775 23.445C17.775 26.595 16.71 29.16 14.58 31.14C12.45 33.12 10.005 33.885 7.245 33.435C10.155 33.21 11.64 33.09 11.64 33.09ZM34.86 33.09C32.13 33.09 29.775 32.31 27.795 30.75C25.815 29.19 24.3525 27.27 23.4075 25C22.4625 22.73 22.6575 20.37 23.0325 17.925C23.4075 15.48 24.3525 12.33 25.8675 8.475L31.3875 0.625H39.3375L34.74 14.715C36.81 15.225 38.37 16.29 39.42 17.91C40.47 19.53 41 21.375 41 23.445C41 26.595 39.935 29.16 37.805 31.14C35.675 33.12 33.225 33.885 30.465 33.435C33.375 33.21 34.86 33.09 34.86 33.09Z" />
  </svg>
);


// --- Landing Page Component ---
const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white dark:bg-slate-900 overflow-x-hidden">
      <PublicHeader onNavigate={onNavigate} />
      <main>
        <HeroSection onNavigate={onNavigate} />
        <LogosSection />
        <ProblemSolutionSection />
        <FeatureShowcaseSection />
        <TestimonialsSection onNavigate={onNavigate} />
        <AdvantageSection />
        <FinalCTASection onNavigate={onNavigate} />
      </main>
    </div>
  );
};


// --- Section Sub-components ---

const HeroSection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex items-center justify-center text-center text-slate-800 dark:text-white overflow-hidden bg-slate-50 dark:bg-slate-900">
        <div className="absolute inset-0 z-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black_70%)]"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900"></div>
        <div className="relative z-10 container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-white">
                The Operating System for Modern Law
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-300">
                Overwhelmed by interruptions and demands? Our AI legal software helps you regain control and stay one step ahead. Run your firm, don't let it run you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                    onClick={() => onNavigate('signup')} 
                    className="w-full sm:w-auto px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    Start Free Trial
                </button>
                <button 
                    onClick={() => onNavigate('demo')} 
                    className="w-full sm:w-auto px-8 py-3 font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
                >
                    Request a Demo
                </button>
            </div>
        </div>
    </section>
);

const LogosSection: React.FC = () => (
    <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
             <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400">TRUSTED BY HUNDREDS OF LEGAL PROFESSIONALS WORLDWIDE</p>
            <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] mt-6">
                 <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll text-slate-400 dark:text-slate-500 text-lg">
                    <li className="font-sans font-extrabold tracking-widest">APEX LAW</li>
                    <li className="font-serif text-xl">Innovate Legal</li>
                    <li className="font-mono">Veritas Group</li>
                    <li className="font-extrabold">Justice LLP</li>
                    <li className="font-serif">Quantum Counsel</li>
                    <li className="font-sans">Stellar Solicitors</li>
                </ul>
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll text-slate-400 dark:text-slate-500 text-lg" aria-hidden="true">
                    <li className="font-sans font-extrabold tracking-widest">APEX LAW</li>
                    <li className="font-serif text-xl">Innovate Legal</li>
                    <li className="font-mono">Veritas Group</li>
                    <li className="font-extrabold">Justice LLP</li>
                    <li className="font-serif">Quantum Counsel</li>
                    <li className="font-sans">Stellar Solicitors</li>
                </ul>
            </div>
        </div>
    </section>
);


const ProblemSolutionSection: React.FC = () => (
    <section className="py-20 bg-white dark:bg-slate-900/70">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Stop letting chaos control your day</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-3xl mx-auto">
               Chasing updates, tracking files, and switching tools costs you time and money. The chaos isn't just frustrating, it's holding your practice back.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-3xl mx-auto">
                LegalDraft AI puts you back in control. Manage cases, tasks, communications, and documents all from one place. The result is less stress, more billables, and a practice that runs on your terms.
            </p>
        </div>
    </section>
);

const FeatureShowcaseSection: React.FC = () => (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Amplify Everything You Do</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
                    Our platform integrates powerful AI tools into your daily workflow, making your practice more efficient and effective.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<BriefcaseIcon className="w-6 h-6" />}
                    title="Unified Case Management"
                    description="See every detail of every case in one place. Manage tasks, documents, and notes effortlessly."
                >
                    <MockUIComponent>
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Matter Dashboard</h3>
                        <div className="mt-2 space-y-2">
                            <div className="flex justify-between items-center p-2 bg-slate-200 dark:bg-slate-700/50 rounded-md">
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">File Motion to Compel</span>
                                <span className="text-xs text-red-500">Due in 2 days</span>
                            </div>
                             <div className="flex justify-between items-center p-2 bg-slate-200 dark:bg-slate-700/50 rounded-md">
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Draft Witness Questions</span>
                                <span className="text-xs text-yellow-500">Due this week</span>
                            </div>
                             <div className="w-full h-6 bg-slate-200 dark:bg-slate-700 rounded-md mt-1 animate-pulse"></div>
                        </div>
                    </MockUIComponent>
                </FeatureCard>
                <FeatureCard
                    icon={<PencilIcon className="w-6 h-6" />}
                    title="AI-Powered Drafting"
                    description="Generate robust, state-specific legal documents from simple prompts in minutes, not hours."
                >
                    <MockUIComponent>
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center">
                            <SparklesIcon className="w-4 h-4 mr-1.5 text-blue-500"/>
                            AI Clause Generator
                        </h3>
                         <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-xs text-slate-700 dark:text-slate-300">
                            <p className="font-bold">Generated Clause:</p>
                            <div className="w-full h-2 mt-2 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                            <div className="w-5/6 h-2 mt-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                            <div className="w-full h-2 mt-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                        </div>
                    </MockUIComponent>
                </FeatureCard>
                <FeatureCard
                    icon={<MailIcon className="w-6 h-6" />}
                    title="Effortless Client Updates"
                    description="Keep clients informed and happy. AI summarizes case progress into clear email drafts automatically."
                >
                    <MockUIComponent>
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">AI Client Update Draft</h3>
                        <div className="mt-2 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700/50 p-2 rounded-md shadow-inner">
                            <p className="font-semibold">To: John Client</p>
                            <div className="w-full h-px my-1.5 bg-slate-200 dark:bg-slate-600"></div>
                            <p>Dear John, Here is a quick update...</p>
                            <div className="w-full h-2 mt-2 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                            <div className="w-5/6 h-2 mt-1 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                        </div>
                    </MockUIComponent>
                </FeatureCard>
            </div>
        </div>
    </section>
);


const TestimonialsSection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100">Legal professionals love how our software delivers</h2>
            <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
                <TestimonialCard 
                    quote="The AI drafter reduced our initial contract creation time by over 70%. The state-specific clauses were spot-on." 
                    author="Jane Doe"
                    title="Partner, Doe & Smith LLC"
                />
                <TestimonialCard 
                    quote="The risk analysis feature is phenomenal. It caught a subtle indemnity clause issue that could have cost us dearly." 
                    author="John Smith"
                    title="In-house Counsel, TechCorp"
                />
            </div>
             <div className="text-center mt-12">
                <button onClick={() => onNavigate('testimonials')} className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    View all customer stories &rarr;
                </button>
            </div>
        </div>
    </section>
);

const AdvantageSection: React.FC = () => (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/70">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">The LegalDraft AI Advantage</h2>
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 text-left max-w-6xl mx-auto">
                <AdvantageCard 
                    icon={<SignatureIcon className="w-8 h-8 text-blue-500" />}
                    title="E-Signatures"
                    description="Seamlessly send documents for e-signature directly from the platform and track their status."
                />
                <AdvantageCard 
                    icon={<ShieldCheckIcon className="w-8 h-8 text-blue-500" />}
                    title="Security"
                    description="Keep your firm's data secure and accessible in the cloud with enterprise-grade security."
                />
                 <AdvantageCard 
                    icon={<SupportIcon className="w-8 h-8 text-blue-500" />}
                    title="Support"
                    description="Connect with exceptional customer care when you need it, available 24/5 via chat and email."
                />
                 <AdvantageCard 
                    icon={<TemplateIcon className="w-8 h-8 text-blue-500" />}
                    title="Custom Templates"
                    description="Create, manage, and reuse your own document templates to ensure consistency and save time."
                />
            </div>
        </div>
    </section>
);

const FinalCTASection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white">Getting started is easy</h2>
            <p className="text-lg text-blue-200 mt-2 max-w-xl mx-auto">Book a demo today and see our AI-powered legal software in action for yourself.</p>
            <button onClick={() => onNavigate('demo')} className="mt-8 px-8 py-3 font-semibold text-blue-600 bg-white rounded-lg hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                Book a Demo
            </button>
        </div>
    </section>
);


// --- Helper Components ---

const MockUIComponent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-4 overflow-hidden mt-4 ${className}`}>
        <div className="flex items-center space-x-1.5 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
            {children}
        </div>
    </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; children: React.ReactNode }> = ({ icon, title, description, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 dark:bg-slate-700 dark:text-blue-400 rounded-lg flex items-center justify-center">{icon}</div>
        <h3 className="mt-4 font-bold text-lg text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1 flex-grow">{description}</p>
        {children}
    </div>
);


const TestimonialCard: React.FC<{quote: string, author: string, title: string}> = ({ quote, author, title }) => {
    const initials = author.split(' ').map(n => n[0]).join('');
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col relative">
            <QuoteIcon className="absolute top-6 left-6 w-8 h-auto text-slate-100 dark:text-slate-700" />
            <p className="text-slate-700 dark:text-slate-300 italic flex-grow pt-8">"{quote}"</p>
            <div className="mt-6 flex items-center">
                 <div className="w-12 h-12 rounded-full mr-4 bg-blue-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <span className="font-semibold text-blue-600 dark:text-blue-300">{initials}</span>
                </div>
                <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{author}</p>
                    <p className="text-slate-500 dark:text-slate-400">{title}</p>
                </div>
            </div>
        </div>
    );
};

const AdvantageCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-transparent hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all duration-300 group">
        <div className="flex-shrink-0 w-14 h-14 bg-blue-100 dark:bg-slate-700 rounded-lg flex items-center justify-center transition-colors group-hover:bg-blue-200/50 dark:group-hover:bg-slate-600">{icon}</div>
        <h3 className="mt-4 font-bold text-lg text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{description}</p>
    </div>
);


export default LandingPage;