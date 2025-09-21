
import React from 'react';

interface RoadmapItem {
    status: 'In Progress' | 'Up Next' | 'Exploring';
    title: string;
    description: string;
}

const InternalRoadmapPage: React.FC = () => {
    const columns: { [key: string]: RoadmapItem[] } = {
        inProgress: [
            { status: 'In Progress', title: 'Advanced Risk Analysis', description: 'Our AI will soon provide a granular risk score (1-100) for each contract, allowing for faster prioritization.' },
            { status: 'In Progress', title: 'Version Comparison (Diff Tool)', description: 'Upload two versions of a document to see a redline comparison of all additions, deletions, and changes.' },
            { status: 'In Progress', title: 'User Management & Roles', description: 'Invite team members and assign roles (Admin, Editor, Viewer) to collaborate securely on contract reviews.' },
        ],
        upNext: [
            { status: 'Up Next', title: 'Branded PDF/CSV Reports', description: 'Export your analysis reports with your firm\'s logo and branding for a professional client-facing deliverable.' },
            { status: 'Up Next', title: 'Shared Template Library', description: 'Teams will be able to create, share, and manage a central library of document templates.' },
            { status: 'Up Next', title: 'Clio & PracticePanther Integration', description: 'Sync documents and analysis results directly with your favorite case management software.' },
        ],
        exploring: [
            { status: 'Exploring', title: 'Multi-Language Support', description: 'We are researching the feasibility of adding support for analyzing contracts in Spanish and French.' },
            { status: 'Exploring', title: 'Full Audit Trails', description: 'For compliance-heavy firms, we are looking into providing a complete log of all actions taken on a document.' },
            { status: 'Exploring', title: 'E-Signature Integration', description: 'Connect with platforms like DocuSign to send documents for signature directly from our app.' },
        ]
    };

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Product Roadmap</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Here’s what we’re working on. Your feedback helps shape our priorities!</p>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <RoadmapColumn title="In Progress" description="Features our team is actively building right now." items={columns.inProgress} />
                <RoadmapColumn title="Up Next" description="Features that are designed and next in the queue." items={columns.upNext} />
                <RoadmapColumn title="Exploring" description="Ideas we're researching based on user feedback." items={columns.exploring} />
            </div>
             <div className="mt-12 text-center bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Have an idea?</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">We'd love to hear it. Your suggestions directly influence what we build next.</p>
                <button className="mt-4 px-5 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700">
                    Submit Feedback
                </button>
            </div>
        </div>
    );
};

const RoadmapColumn: React.FC<{ title: string; description: string; items: RoadmapItem[] }> = ({ title, description, items }) => (
    <div className="space-y-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <div className="space-y-4">
            {items.map(item => <RoadmapCard key={item.title} {...item} />)}
        </div>
    </div>
);

const RoadmapCard: React.FC<RoadmapItem> = ({ status, title, description }) => {
    const statusStyles: Record<RoadmapItem['status'], string> = {
        'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'Up Next': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        'Exploring': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>
            <h3 className="mt-3 font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
    );
};

export default InternalRoadmapPage;