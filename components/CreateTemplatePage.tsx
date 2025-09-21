import React, { useState, useEffect, useRef } from 'react';
import { Template } from '../types';
import ErrorAlert from './ErrorAlert';
import { generatePlaceholderSuggestions } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';

declare const EasyMDE: any;

interface CreateTemplatePageProps {
    onSave: (template: Omit<Template, 'id' | 'created_at' | 'placeholders' | 'user_id'>, existingId?: string) => Promise<void>;
    existingTemplate?: Template | null;
}

const CreateTemplatePage: React.FC<CreateTemplatePageProps> = ({ onSave, existingTemplate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const easymdeInstance = useRef<any>(null);
    const [placeholderSuggestions, setPlaceholderSuggestions] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Effect to handle initialization and cleanup of the editor
    useEffect(() => {
        if (!textareaRef.current || easymdeInstance.current) {
            return;
        }

        if (typeof EasyMDE !== 'undefined') {
            const easymde = new EasyMDE({
                element: textareaRef.current,
                initialValue: content,
                spellChecker: false,
                minHeight: '300px',
                placeholder: 'Type your template content here... Use {{placeholder}} for variables.',
                toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "|", "preview", "side-by-side", "fullscreen"],
                status: ["lines", "words"],
                codemirror: {
                    mode: 'markdown',
                    addModeClass: true,
                }
            });

            // Get CodeMirror constructor from the instance to avoid race conditions with global script loading
            const CodeMirror = easymde.codemirror.constructor;

            const placeholderOverlay = {
                token: function(stream: any) {
                    // Match {{...}} placeholders
                    if (stream.match("{{")) {
                        stream.eatWhile(/[\w\s_]/);
                        if (stream.match("}}")) {
                            return "placeholder"; // CSS class cm-placeholder will be applied
                        }
                    }
                    // Move to the next potential match
                    while (stream.next() != null && !stream.match("{{", false)) {}
                    return null;
                }
            };

            // Define a new mode that overlays our placeholder logic onto the base markdown mode
            CodeMirror.defineMode("markdown-placeholder", function(config: any) {
                const markdownMode = CodeMirror.getMode(config, "markdown");
                return CodeMirror.overlayMode(markdownMode, placeholderOverlay);
            });

            // Set the new combined mode on the editor instance
            easymde.codemirror.setOption("mode", "markdown-placeholder");


            easymde.codemirror.on('change', () => {
                // Sync editor content with React state
                setContent(easymde.value());
            });

            easymdeInstance.current = easymde;
        }

        // Cleanup function
        return () => {
            if (easymdeInstance.current) {
                easymdeInstance.current.toTextArea();
                easymdeInstance.current = null;
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // Effect to populate form when `existingTemplate` changes
    useEffect(() => {
        if (existingTemplate) {
            setName(existingTemplate.name || '');
            setDescription(existingTemplate.description || '');
            const initialContent = existingTemplate.content || '';
            setContent(initialContent);
            if (easymdeInstance.current && easymdeInstance.current.value() !== initialContent) {
                easymdeInstance.current.value(initialContent);
            }
        } else {
            // Reset form for "Create New" after editing
            setName('');
            setDescription('');
            setContent('');
            if (easymdeInstance.current) {
                easymdeInstance.current.value('');
            }
        }
    }, [existingTemplate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await onSave({ name, description, content }, existingTemplate?.id);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unexpected error occurred while saving.');
        }
    };
    
    const handleAnalyzeContent = async () => {
        if (!content.trim()) return;
        setIsAnalyzing(true);
        setError(null);
        try {
            const suggestions = await generatePlaceholderSuggestions(content);
            setPlaceholderSuggestions(suggestions);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to analyze content.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const insertPlaceholder = (placeholder: string) => {
        if (easymdeInstance.current) {
            const cm = easymdeInstance.current.codemirror;
            cm.replaceSelection(`{{${placeholder}}}`);
            cm.focus();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                {existingTemplate ? 'Edit Template' : 'Create New Template'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
                Templates allow you to reuse boilerplate text for common documents.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                {error && <div className="mb-4"><ErrorAlert message={error} title="Error" /></div>}
                <div>
                    <label htmlFor="templateName" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Template Name</label>
                    <input type="text" id="templateName" value={name} onChange={e => setName(e.target.value)} required className="w-full input-field" placeholder="e.g., Standard Freelancer NDA" />
                </div>
                 <div>
                    <label htmlFor="templateDescription" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description</label>
                    <input type="text" id="templateDescription" value={description} onChange={e => setDescription(e.target.value)} className="w-full input-field" placeholder="A brief summary of what this template is for." />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="templateContent" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Template Content</label>
                        <button type="button" onClick={handleAnalyzeContent} disabled={isAnalyzing} className="text-xs inline-flex items-center px-2 py-1 border border-transparent font-medium rounded-md shadow-sm text-white bg-slate-500 hover:bg-slate-600 disabled:bg-slate-300">
                            <SparklesIcon className="w-4 h-4 mr-1.5" />
                            {isAnalyzing ? 'Analyzing...' : 'Analyze for Placeholders'}
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        {'Use double curly braces for placeholders, e.g., `{{client_name}}`, `{{effective_date}}`. These will be highlighted.'}
                    </p>
                    <textarea id="templateContent" ref={textareaRef} defaultValue={content} />
                    {placeholderSuggestions.length > 0 && (
                        <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                            <p className="text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">AI Suggestions (click to insert):</p>
                            <div className="flex flex-wrap gap-2">
                                {placeholderSuggestions.map(p => (
                                    <button type="button" key={p} onClick={() => insertPlaceholder(p)} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800">
                                        {`{{${p}}}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    {existingTemplate ? 'Save Changes' : 'Create Template'}
                </button>
            </form>
        </div>
    );
};

export default CreateTemplatePage;