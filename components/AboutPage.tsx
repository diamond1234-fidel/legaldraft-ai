import React from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';
import BriefcaseIcon from './icons/BriefcaseIcon';
import SparklesIcon from './icons/SparklesIcon';

const AboutPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    return (
        <div className="bg-white dark:bg-slate-900">
            <PublicHeader onNavigate={onNavigate} currentPage="about" />
            <main>
                <HeroSection />
                <MissionSection />
                <TeamSection />
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
                For Lawyers, By Innovators
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                We're a team of technologists and legal professionals passionate about building software that empowers lawyers to do their best work, faster.
            </p>
        </div>
    </section>
);

const MissionSection: React.FC = () => (
    <section className="py-20 md:py-28 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Our Mission</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        The practice of law is complex and demanding. We saw brilliant lawyers spending too much of their valuable time on repetitive, administrative tasks—time that could be better spent on case strategy and client relationships.
                    </p>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        Our mission is to eliminate that administrative burden. We build intelligent, intuitive tools that handle the paperwork, so you can focus on what truly matters: your clients.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <StatCard icon={<BriefcaseIcon className="w-8 h-8 text-blue-500" />} value="50,000+" label="Hours saved for our clients" />
                    <StatCard icon={<SparklesIcon className="w-8 h-8 text-blue-500" />} value="99.7%" label="Accuracy rate in AI analysis" />
                </div>
            </div>
        </div>
    </section>
);

const StatCard: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
        {icon}
        <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
);


const TeamSection: React.FC = () => {
    const team = [
        { name: 'Alex Chen', role: 'CEO & Co-Founder', avatar: 'https://i.pravatar.cc/150?u=alex' },
        { name: 'Brenda Smith', role: 'Head of Product', avatar: 'https://i.pravatar.cc/150?u=brenda' },
        { name: 'Carlos Gomez', role: 'Lead AI Engineer', avatar: 'https://i.pravatar.cc/150?u=carlos' },
        { name: 'Diana Jones', role: 'Head of Legal Innovation', avatar: 'https://i.pravatar.cc/150?u=diana' },
    ];
    return (
        <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900/70">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Meet the Team</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        We're a diverse group of experts dedicated to revolutionizing legal tech.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 max-w-4xl mx-auto">
                    {team.map(member => (
                        <div key={member.name} className="text-center">
                            <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mx-auto shadow-lg" />
                            <h3 className="mt-4 font-bold text-slate-800 dark:text-slate-100">{member.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FinalCTASection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold text-white">Join Us on Our Mission</h2>
            <p className="text-lg text-blue-200 mt-2 max-w-xl mx-auto">See how our platform can transform your practice. Start your free trial today.</p>
            <button onClick={() => onNavigate('signup')} className="mt-8 px-8 py-3 font-semibold text-blue-600 bg-white rounded-lg hover:bg-slate-100 transition-transform hover:scale-105 shadow-2xl">
                Start My Free Trial
            </button>
        </div>
    </section>
);


export default AboutPage;