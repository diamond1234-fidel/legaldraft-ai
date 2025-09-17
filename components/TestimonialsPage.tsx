import React from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';

const TestimonialsPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const testimonials = [
        {
            quote: "LegalDraft AI has become an indispensable tool for our firm. The AI drafter reduced our initial contract creation time by over 70%, allowing our attorneys to focus on high-value strategic work.",
            author: "Jane Doe",
            title: "Partner, Doe & Smith LLC",
            avatar: "https://i.pravatar.cc/150?u=jane"
        },
        {
            quote: "The risk analysis feature is phenomenal. It caught a subtle indemnity clause issue in a vendor agreement that could have cost us dearly. It's now a mandatory step in our review process.",
            author: "John Smith",
            title: "In-house Counsel, TechCorp",
            avatar: "https://i.pravatar.cc/150?u=john"
        },
        {
            quote: "The case management and task tracking features are a lifesaver. Our firm is more organized than ever, and nothing falls through the cracks. Our paralegals can finally stay ahead of deadlines.",
            author: "Sarah Jenkins",
            title: "Lead Paralegal, Apex Law",
            avatar: "https://i.pravatar.cc/150?u=sarah"
        },
        {
            quote: "As a solo practitioner, efficiency is everything. This tool automates the most tedious parts of my job. The AI-generated client updates are surprisingly human-like and save me a ton of time.",
            author: "Emily White",
            title: "Founder, White Legal",
            avatar: "https://i.pravatar.cc/150?u=emily"
        },
        {
            quote: "Our paralegals love the template management and document organization features. It has fundamentally improved our firm's workflow and reduced the chance of manual errors.",
            author: "Michael Brown",
            title: "Managing Partner, Brown & Associates",
            avatar: "https://i.pravatar.cc/150?u=michael"
        },
        {
            quote: "The predictive analytics tool is incredibly powerful. It gives us a data-driven edge in strategic decision-making for our most critical motions. We feel like we're a step ahead of the opposition.",
            author: "Maria Rodriguez",
            title: "Litigation Head, Veritas Group",
            avatar: "https://i.pravatar.cc/150?u=maria"
        }
    ];

    return (
        <div className="bg-white dark:bg-slate-900">
            <PublicHeader onNavigate={onNavigate} currentPage="testimonials" />
            <main>
                <HeroSection />
                <LogosSection />
                <TestimonialsGrid testimonials={testimonials} />
                <StatsSection />
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
                Hear What Our Customers Are Saying
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                Discover how firms like yours are saving time, winning cases, and growing their practice with LegalDraft AI.
            </p>
        </div>
    </section>
);

const LogosSection: React.FC = () => (
    <section className="py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
            <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trusted by professionals at firms like</p>
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

const TestimonialsGrid: React.FC<{ testimonials: { quote: string; author: string; title: string; avatar: string; }[] }> = ({ testimonials }) => (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/70">
        <div className="container mx-auto px-4">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
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

const StatsSection: React.FC = () => (
    <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <StatItem value="70%" label="Reduction in drafting time" />
                <StatItem value="40+" label="Hours saved per month, per lawyer" />
                <StatItem value="98%" label="Customer Satisfaction" />
            </div>
        </div>
    </section>
);

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div>
        <p className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">{value}</p>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{label}</p>
    </div>
);

const FinalCTASection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white">Join Hundreds of Satisfied Professionals</h2>
            <p className="text-lg text-blue-200 mt-2 max-w-xl mx-auto">Experience the difference for yourself. Start your free 14-day trial today. No credit card required.</p>
            <button onClick={() => onNavigate('signup')} className="mt-8 px-8 py-3 font-semibold text-blue-600 bg-white rounded-lg hover:bg-slate-100 transition-transform hover:scale-105 shadow-2xl">
                Start My Free Trial
            </button>
        </div>
    </section>
);

export default TestimonialsPage;
