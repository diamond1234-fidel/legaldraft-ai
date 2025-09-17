
import React, { useState } from 'react';
import { Template, Page } from '../types';
import TemplateIcon from './icons/TemplateIcon';
import ErrorAlert from './ErrorAlert';
import Modal from './Modal';

declare var marked: any;

interface TemplateManagerPageProps {
    templates: Template[];
    onEdit: (template: Template) => void;
    onDelete: (templateId: string) => Promise<void>;
    onNavigate: (page: Page) => void;
}

const TemplateManagerPage: React.FC<TemplateManagerPageProps> = ({ templates, onEdit, onDelete, onNavigate }) => {
    const [error, setError] = useState<string | null>(null);
    const [previewingTemplate, setPreviewingTemplate] = useState<Template | null>(null);

    const handlePreview = (template: Template) => {
        setPreviewingTemplate(template);
    };

    const handleClosePreview = () => {
        setPreviewingTemplate(null);
    };

    const handleDelete = async (template: Template) => {
        setError(null);
        if (window.confirm(`Are you sure you want to delete the template "${template.name}"? This action cannot be undone.`)) {
            try {
                await onDelete(template.id);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
            }
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Document Templates</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your reusable contract templates.</p>
                </div>
                <button onClick={() => onNavigate('createTemplate')} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 self-start sm:self-center">
                    Create New Template
                </button>
            </div>
            
            {error && <div className="mb-4"><ErrorAlert message={error} title="Deletion Failed" /></div>}
            
             {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {templates.length > 0 ? templates.map((template) => (
                    <div key={template.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-4">
                        <div className="font-bold text-slate-800 dark:text-slate-100">{template.name}</div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{template.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                             {(Array.isArray(template.placeholders) ? template.placeholders : []).slice(0, 3).map((p, index) => (
                                <span key={index} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-mono">{`{{${p}}}`}</span>
                            ))}
                            {(Array.isArray(template.placeholders) ? template.placeholders.length : 0) > 3 && <span className="text-xs text-slate-400">...</span>}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end space-x-4 text-sm font-medium">
                            <button onClick={() => handlePreview(template)} className="text-green-600 dark:text-green-400">Preview</button>
                            <button onClick={() => {}} className="text-blue-600 dark:text-blue-400">Use</button>
                            <button onClick={() => onEdit(template)} className="text-yellow-600 dark:text-yellow-400">Edit</button>
                            <button onClick={() => handleDelete(template)} className="text-red-600 dark:text-red-400">Delete</button>
                        </div>
                    </div>
                )) : (
                     <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <TemplateIcon className="w-12 h-12 mx-auto mb-2" />
                        <p className="font-semibold">No templates created yet.</p>
                        <p className="text-sm">Create a template to get started.</p>
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Template Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Placeholders</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                         <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {templates.length > 0 ? templates.map((template) => (
                                <tr key={template.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">{template.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">{template.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-wrap gap-1">
                                            {(Array.isArray(template.placeholders) ? template.placeholders : []).slice(0, 3).map((p, index) => (
                                                <span key={index} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-mono">{`{{${p}}}`}</span>
                                            ))}
                                            {(Array.isArray(template.placeholders) ? template.placeholders.length : 0) > 3 && <span className="text-xs text-slate-400">...</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <button onClick={() => handlePreview(template)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">Preview</button>
                                        <button onClick={() => {}} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">Use</button>
                                        <button onClick={() => onEdit(template)} className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">Edit</button>
                                        <button onClick={() => handleDelete(template)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-12">
                                        <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                                            <TemplateIcon className="w-12 h-12 mb-2" />
                                            <p className="font-semibold">No templates created yet.</p>
                                            <p className="text-sm">Create a template to get started.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                         </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={!!previewingTemplate} onClose={handleClosePreview} title={`Preview: ${previewingTemplate?.name}`}>
                {previewingTemplate && (
                    <div
                        className="prose prose-slate dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: marked.parse(previewingTemplate.content || 'No content to display.') }}
                    ></div>
                )}
            </Modal>
        </div>
    );
};

export default TemplateManagerPage;
