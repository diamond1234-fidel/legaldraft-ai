
import React from 'react';
import { DocumentVersion } from '../types';
import HistoryIcon from './icons/HistoryIcon';

interface VersionHistoryPanelProps {
    versions: DocumentVersion[];
    onView: (version: DocumentVersion) => void;
    onRevert: (version: DocumentVersion) => void;
}

const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({ versions, onView, onRevert }) => {
    if (!versions || versions.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 mt-4">
                <HistoryIcon className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                <p>No previous versions found.</p>
            </div>
        );
    }

    // Sort versions descending
    const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

    return (
        <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4">
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {sortedVersions.map((v) => (
                    <li key={v.version} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">
                                Version {v.version}
                                <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">({new Date(v.createdAt).toLocaleString()})</span>
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{v.description || 'No description'}"</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2 self-end sm:self-center">
                            <button onClick={() => onView(v)} className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-200 rounded-md hover:bg-blue-200">View</button>
                            <button onClick={() => onRevert(v)} className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-200 rounded-md hover:bg-yellow-200">Revert</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VersionHistoryPanel;