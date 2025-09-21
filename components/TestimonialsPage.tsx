import React from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';

const TestimonialsPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
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
        {
            quote: "As a solo attorney, I don't have a large team to bounce ideas off of. Contract Review AI acts like a second set of eyes, catching things I might miss and helping me draft stronger agreements for my clients.",
            author: "Emily White",
            title: "Solo Practitioner, White Legal",
            avatar: "https://i.pravatar.cc/150?u=emily"
        },
        {
            quote: "We use it to get a quick first-pass on all inbound sales contracts. It helps our sales team understand the key terms before it even gets to legal, which speeds up our deal cycle significantly.",
            author: "Michael Brown",
            title: "VP of Sales, Tech Solutions Ltd.",
            avatar: "https://i.pravatar.cc/150?u=michael"
        },
    ];

    return (
        <div className="bg-white dark:bg-slate-900">
            <PublicHeader onNavigate={onNavigate} currentPage="testimonials" />
            <main>
                <HeroSection />
                <LogoCloud />
                <TestimonialsGrid testimonials={testimonials} />
                <FinalCTASection onNavigate={onNavigate} />
            </main>
        </div>
    );
};

const HeroSection: React.FC = () => (
    <section className="relative text-center py-20 md:py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tighter">
                Trusted by Founders, Lawyers, and Dealmakers
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                See how professionals are saving time, mitigating risk, and closing deals faster with our AI.
            </p>
        </div>
    </section>
);

const LogoCloud: React.FC = () => (
    <div className="bg-white dark:bg-slate-900 py-12">
        <div className="container mx-auto px-4">
            <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Powering professionals at companies like
            </p>
            <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
                <div className="col-span-1 flex justify-center lg:col-span-1">
                    <span className="text-slate-400 dark:text-slate-500 font-medium text-lg">Innovate Corp</span>
                </div>
                <div className="col-span-1 flex justify-center lg:col-span-1">
                    <span className="text-slate-400 dark:text-slate-500 font-medium text-lg">Quantum</span>
                </div>
                <div className="col-span-1 flex justify-center lg:col-span-1">
                     <span className="text-slate-400 dark:text-slate-500 font-medium text-lg">Apex Legal</span>
                </div>
                <div className="col-span-1 flex justify-center lg:col-span-1">
                    <span className="text-slate-400 dark:text-slate-500 font-medium text-lg">Summit</span>
                </div>
                <div className="col-span-2 flex justify-center lg:col-span-1">
                    <span className="text-slate-400 dark:text-slate-500 font-medium text-lg">Nexus</span>
                </div>
            </div>
        </div>
    </div>
);


const TestimonialsGrid: React.FC<{ testimonials: { quote: string; author: string; title: string; avatar: string; }[] }> = ({ testimonials }) => (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/70">
        <div className="container mx-auto px-4">
            <div className="columns-1 md:columns-2 gap-8 space-y-8">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="break-inside-avoid bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col">
                        <p className="text-slate-700 dark:text-slate-300 flex-grow">"{testimonial.quote}"</p>
                        <div className="mt-6 flex items-center">
                            <img src={testimonial.avatar} alt={testimonial.author} className="w-10 h-10 rounded-full mr-4" />
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{testimonial.author}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FinalCTASection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Analyze Your First Contract?</h2>
            <p className="text-lg text-blue-200 mt-2">Start your free trial and see the power of AI in action. No credit card required.</p>
            <button onClick={() => onNavigate('signup')} className="mt-8 px-8 py-3 font-semibold text-blue-600 bg-white rounded-lg hover:bg-slate-100 transition-transform hover:scale-105 shadow-2xl">
                Start My Free Trial
            </button>
        </div>
    </section>
);

export default TestimonialsPage;