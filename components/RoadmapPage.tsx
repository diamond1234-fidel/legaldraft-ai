import React from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';

interface RoadmapPageProps {
  onNavigate: (page: Page) => void;
}

const RoadmapPage: React.FC<RoadmapPageProps> = ({ onNavigate }) => {
    return (
        <div className="bg-white dark:bg-slate-900">
            <PublicHeader onNavigate={onNavigate} currentPage="roadmap" />
            <main>
                <HeroSection />
                <RoadmapBoard onNavigate={onNavigate} />
            </main>
        </div>
    );
};

const HeroSection: React.FC = () => (
    <section className="relative text-center py-20 md:py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tighter">
                Our Product Roadmap
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                We're constantly working to improve our platform. Here's a look at what we're building next, based on your feedback.
            </p>
        </div>
    </section>
);

interface RoadmapItem {
    status: 'In Progress' | 'Launched' | 'Planned' | 'Under Consideration' | 'Researching';
    title: string;
    description: string;
}

const RoadmapBoard: React.FC<{onNavigate: (page: Page) => void}> = ({ onNavigate }) => {
    const columns: { [key: string]: RoadmapItem[] } = {
        now: [
            { status: 'In Progress', title: 'Core Document Analysis', description: 'Batch upload and parsing for PDF, DOCX, and TXT files with automatic text extraction.' },
            { status: 'In Progress', title: 'Key Clause Detection', description: 'Automatic identification and extraction of critical clauses like Termination, Indemnity, and Liability.' },
            { status: 'Launched', title: 'Data Highlights & Summaries', description: 'Generate summary tables of key dates, parties, and obligations for quick review.' },
            { status: 'Launched', title: 'Search & Filtering', description: 'Full-text search across your document library with filters for risk level, date, and party.' },
        ],
        next: [
            { status: 'Planned', title: 'Advanced Risk Analysis', description: 'AI-powered flagging of unusual or high-risk clauses with a risk score for each contract.' },
            { status: 'Planned', title: 'Version Comparison Tool', description: 'Visually compare two versions of a document to see exactly what has changed.' },
            { status: 'Planned', title: 'Enhanced Reporting', description: 'Export detailed analysis reports and summary tables in CSV, Excel, and branded PDF formats.' },
            { status: 'Planned', title: 'User Management', description: 'Support for multiple users per firm with role-based permissions (Admin, Editor, Read-Only).' },
        ],
        later: [
            { status: 'Under Consideration', title: 'Multi-Language Support', description: 'Extend analysis capabilities to contracts written in Spanish, German, and French.' },
            { status: 'Under Consideration', title: 'Full Audit Trails', description: 'Track all user activity, including document uploads, reviews, and changes, for compliance.' },
            { status: 'Researching', title: 'International Market Expansion', description: 'Tailor analysis for additional jurisdictions like the UK, Canada, and Australia.' },
        ]
    };

    return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <RoadmapColumn title="Now" description="Features we're currently building or have just released." items={columns.now} />
                    <RoadmapColumn title="Next" description="Features that are planned and will be worked on soon." items={columns.next} />
                    <RoadmapColumn title="Later" description="Ideas we're exploring for the future." items={columns.later} />
                </div>
                <div className="mt-16 text-center bg-slate-50 dark:bg-slate-800/50 p-8 rounded-lg border border-slate-200 dark:border-slate-800">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Have a Feature Request?</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Your feedback shapes our roadmap. Let us know what you'd like to see next.</p>
                    <button onClick={() => onNavigate('support')} className="mt-6 px-6 py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Suggest a Feature
                    </button>
                </div>
            </div>
        </section>
    );
};

const RoadmapColumn: React.FC<{ title: string; description: string; items: RoadmapItem[] }> = ({ title, description, items }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <div className="space-y-4">
            {items.map(item => <RoadmapCard key={item.title} {...item} />)}
        </div>
    </div>
);

const RoadmapCard: React.FC<RoadmapItem> = ({ status, title, description }) => {
    const statusStyles: Record<RoadmapItem['status'], string> = {
        'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'Launched': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Planned': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        'Under Consideration': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'Researching': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>
            <h3 className="mt-3 font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
    );
};

export default RoadmapPage;