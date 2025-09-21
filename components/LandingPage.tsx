import React from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import EyeIcon from './icons/EyeIcon';
import UploadIcon from './icons/UploadIcon';
import SparklesIcon from './icons/SparklesIcon';

// Local Icon definitions for self-containment
const LockClosedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);
const EyeSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243-4.243-4.243" />
  </svg>
);
const ServerStackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const LandingPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  return (
    <div className="bg-white dark:bg-slate-900 overflow-x-hidden">
      <PublicHeader onNavigate={onNavigate} />
      <main>
        <HeroSection onNavigate={onNavigate} />
        <TrustedBySection />
        <HowItWorksSection />
        <FeatureShowcaseSection />
        <SecuritySection />
        <PricingSection onNavigate={onNavigate} />
        <TestimonialsSection onNavigate={onNavigate} />
        <FinalCTASection onNavigate={onNavigate} />
      </main>
    </div>
  );
};

const AnalysisPreviewGraphic: React.FC = () => (
    <div className="relative mx-auto border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 border-2 rounded-xl shadow-2xl shadow-slate-300/40 dark:shadow-slate-900/80">
        <div className="flex items-center justify-start p-3 border-b border-slate-200 dark:border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-1.5"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="ml-auto h-5 bg-slate-100 dark:bg-slate-700 rounded-md w-1/3"></div>
        </div>
        <div className="p-6 space-y-4">
            <div className="h-5 bg-slate-100 dark:bg-slate-700 rounded-md w-2/3"></div>
             <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-16 bg-red-100 dark:bg-red-500/20 rounded-full flex-shrink-0"></div>
                    <div className="h-3 w-4/5 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                </div>
                 <div className="pl-4">
                     <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-700 rounded-md"></div>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="h-4 w-20 bg-yellow-100 dark:bg-yellow-500/20 rounded-full flex-shrink-0"></div>
                    <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="h-4 w-12 bg-green-100 dark:bg-green-500/20 rounded-full flex-shrink-0"></div>
                    <div className="h-3 w-4/6 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                </div>
            </div>
             <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-md w-1/3 mt-6"></div>
             <div className="space-y-3 pt-2">
                 <div className="h-2 w-full bg-slate-200 dark:bg-slate-600 rounded-md"></div>
                 <div className="h-2 w-5/6 bg-slate-200 dark:bg-slate-600 rounded-md"></div>
             </div>
        </div>
    </div>
);

const TrustedBySection: React.FC = () => {
    const logos = ["Innovate Corp", "Quantum Ventures", "Apex Legal", "Summit Foundation", "Nexus Innovations", "Stellar Group"];
    const allLogos = [...logos, ...logos, ...logos, ...logos];

    return (
        <section className="py-12 bg-slate-50 dark:bg-slate-900/70">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Trusted by leading founders and legal teams</p>
                <div className="mt-8 w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll">
                        {allLogos.map((logo, index) => (
                            <li key={index} className="text-slate-400 dark:text-slate-500 font-medium text-lg whitespace-nowrap">
                                {logo}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

const SecuritySection: React.FC = () => (
    <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                 <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Security You Can Depend On</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-4">
                    We understand the sensitivity of legal documents. Your privacy and security are our highest priority.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <SecurityPillar
                    icon={<LockClosedIcon className="w-8 h-8 text-blue-500" />}
                    title="End-to-End Encryption"
                    description="Your data is encrypted in transit and at rest using industry-standard protocols. Only you can access your documents."
                />
                 <SecurityPillar
                    icon={<EyeSlashIcon className="w-8 h-8 text-blue-500" />}
                    title="Confidentiality Assured"
                    description="We will never use your contract data to train our AI models. Your confidential information remains yours, always."
                />
                 <SecurityPillar
                    icon={<ServerStackIcon className="w-8 h-8 text-blue-500" />}
                    title="Secure Infrastructure"
                    description="Built on enterprise-grade infrastructure with strict access controls to ensure your data is protected and isolated."
                />
            </div>
        </div>
    </section>
);

const SecurityPillar: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">{icon}</div>
        <h3 className="mt-4 font-bold text-lg text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{description}</p>
    </div>
);

const HeroSection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-slate-50 dark:bg-slate-900">
        <div className="absolute inset-0 z-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black_70%)]"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900"></div>
        <div className="relative z-10 container mx-auto px-4">
             <div className="grid lg:grid-cols-5 gap-16 items-center">
                <div className="text-center lg:text-left lg:col-span-3">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
                        Review Contracts with Confidence
                    </h1>
                    <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-slate-600 dark:text-slate-300">
                        Securely upload any contract and let our AI instantly identify risks, flag missing clauses, and suggest improvements, so you can negotiate smarter.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                        <button 
                            onClick={() => onNavigate('signup')} 
                            className="w-full sm:w-auto px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Analyze Your First Contract Free
                        </button>
                    </div>
                </div>
                <div className="hidden lg:block lg:col-span-2">
                    <AnalysisPreviewGraphic />
                </div>
            </div>
        </div>
    </section>
);

const HowItWorksSection: React.FC = () => (
    <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Get Actionable Insights in 3 Simple Steps</h2>
            <div className="mt-12 grid md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto text-left">
                <HowItWorksStep
                    number="01"
                    title="Upload Your Contract"
                    description="Securely upload any contract in PDF, DOCX, or plain text format. Our system reliably extracts the text, even from scanned documents."
                    icon={<UploadIcon className="w-8 h-8 text-blue-500" />}
                />
                <HowItWorksStep
                    number="02"
                    title="AI Analyzes Instantly"
                    description="Our AI reads and understands your contract, analyzing it for key terms, risks, missing clauses, and obligations based on best practices."
                    icon={<SparklesIcon className="w-8 h-8 text-blue-500" />}
                />
                 <HowItWorksStep
                    number="03"
                    title="Receive Your Report"
                    description="Get a clear, structured report with a summary, a prioritized list of red flags, a checklist of missing terms, and suggested fixes."
                    icon={<EyeIcon className="w-8 h-8 text-blue-500" />}
                />
            </div>
        </div>
    </section>
);

const HowItWorksStep: React.FC<{ number: string; title: string; description: string; icon: React.ReactNode }> = ({ number, title, description, icon }) => (
    <div className="relative p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center mb-3">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mr-4">{icon}</div>
            <div className="text-5xl font-extrabold text-slate-200 dark:text-slate-700">{number}</div>
        </div>
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{description}</p>
    </div>
);

const FeatureShowcaseSection: React.FC = () => (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">A Toolkit for Smarter Negotiations</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-3xl mx-auto">
                    Go beyond simple spell-checking. Our AI gives you the insights you need to understand and improve any contract.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                <div className="space-y-8">
                    <FeatureDetail title="Identify Critical Risks" description="Instantly spot one-sided terms, ambiguous language, and potential liabilities. Each risk is categorized by severity so you know what to focus on." />
                    <FeatureDetail title="Find Missing Clauses" description="Our AI checks your document against a database of common legal clauses to ensure you're not missing critical protections like indemnity, confidentiality, or termination rights." />
                    <FeatureDetail title="Get Plain-Language Fixes" description="Receive clear, actionable suggestions to improve confusing language, close loopholes, and strengthen your position." />
                </div>
                <div>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                        <h4 className="font-semibold text-slate-500 dark:text-slate-400 text-sm">AI ANALYSIS REPORT</h4>
                        <div className="border-l-4 border-red-500 pl-4">
                            <span className="text-xs font-bold text-red-600 dark:text-red-400">HIGH RISK</span>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">Uncapped liability for Party A.</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">"Party B shall be held harmless for any and all damages..."</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">MEDIUM RISK</span>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">Ambiguous termination for convenience clause.</p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">MISSING CLAUSE</span>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">Confidentiality clause is not present.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const FeatureDetail: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{description}</p>
    </div>
);

const PricingSection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Simple, Affordable Pricing</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
                Get started for free. Upgrade when you're ready. With monthly, annual, and one-time lifetime options, there's a plan for everyone.
            </p>
            <div className="mt-8">
                 <button onClick={() => onNavigate('pricing')} className="px-6 py-3 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    View Pricing Plans
                </button>
            </div>
        </div>
    </section>
);

const TestimonialsSection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const testimonials = [
        {
            quote: "This tool is a game-changer for our startup. We can now review vendor contracts and term sheets with much more confidence, without racking up huge legal bills for initial drafts.",
            author: "Jane Doe",
            title: "Founder, Acme Corp",
            avatar: "https://i.pravatar.cc/150?u=jane"
        },
        {
            quote: "The risk analysis is incredibly sharp. It flagged a non-standard indemnity clause in a partnership agreement that could have cost us dearly. It's now a mandatory step in our review process.",
            author: "John Smith",
            title: "General Counsel, Innovate Inc.",
            avatar: "https://i.pravatar.cc/150?u=john"
        },
    ];

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Don't Just Take Our Word For It</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-4">
                       See how professionals are saving time, mitigating risk, and closing deals faster with our AI.
                    </p>
                </div>
                <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {testimonials.map((testimonial) => (
                        <figure key={testimonial.author} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col">
                            <blockquote className="flex-grow">
                                <p className="text-lg text-slate-700 dark:text-slate-300">
                                    “{testimonial.quote}”
                                </p>
                            </blockquote>
                            <figcaption className="mt-6 flex items-center">
                                 <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <div className="text-base text-slate-800 dark:text-slate-100 font-semibold">{testimonial.author}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.title}</div>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FinalCTASection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white">Get peace of mind with AI-powered analysis.</h2>
            <p className="text-lg text-blue-200 mt-2 max-w-xl mx-auto">Analyze your first 5 contracts for free. No credit card required.</p>
            <button onClick={() => onNavigate('signup')} className="mt-8 px-8 py-3 font-semibold text-blue-600 bg-white rounded-lg hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                Sign Up for Free
            </button>
        </div>
    </section>
);

export default LandingPage;