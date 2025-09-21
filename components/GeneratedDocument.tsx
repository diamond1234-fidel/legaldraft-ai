import React, { useState } from 'react';
import { ContractAnalysis, Document } from '../types';
import WordIcon from './icons/WordIcon';
import PdfIcon from './icons/PdfIcon';
import TemplateIcon from './icons/TemplateIcon';
import saveAs from 'file-saver';
// FIX: IBlockContent and IBulletOptions are not exported in recent versions of docx.
// Replaced IBlockContent with Paragraph where it was used as a type.
import { Document as DocxDocument, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

// marked is assumed to be loaded from a script tag
declare var marked: any;

interface AnalysisReportProps {
    // FIX: Make analysis optional to support generated documents without analysis.
    analysis?: ContractAnalysis;
    document: Document;
    onReset: () => void;
    onCreateTemplate: (doc: Document) => void;
    onUpdateDocument: (doc: Document) => Promise<void>;
}

const SeverityBadge: React.FC<{ severity: 'High' | 'Medium' | 'Low' }> = ({ severity }) => {
    const config = {
        High: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
        Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
        Low: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${config[severity]}`}>{severity}</span>;
};

const AnalysisReport: React.FC<AnalysisReportProps> = ({ analysis, document, onReset, onCreateTemplate, onUpdateDocument }) => {
    const [isExporting, setIsExporting] = useState(false);

    // FIX: Conditionally render for generated documents if no analysis is provided.
    // This fixes the props error in DraftContractPage.
    if (!analysis) {
        // This is a drafted document, not an analysis report.
        return (
          <div className="space-y-6">
            <div className="prose prose-slate dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 h-96 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: marked.parse(document.content || 'Generating document...') }} />
            </div>
            <div className="flex-shrink-0 pt-4 flex flex-col sm:flex-row gap-2 justify-end">
              <button onClick={() => onCreateTemplate(document)} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                  <TemplateIcon className="w-4 h-4 mr-2" />
                  Create Template
              </button>
              <button onClick={onReset} className="px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-md hover:bg-slate-700">
                  Draft Another
              </button>
            </div>
          </div>
        );
    }

    const analysisToMarkdown = () => {
        let md = `# Contract Analysis: ${document.name}\n\n`;
        md += `## Summary\n${analysis.summary}\n\n`;
        md += `## Risks & Red Flags\n`;
        if (analysis.risks.length > 0) {
            analysis.risks.forEach(risk => {
                md += `*   **[${risk.severity}]** ${risk.description}\n`;
                md += `    > *Snippet:* ${risk.snippet}\n`;
            });
        } else {
            md += "No major risks were identified.\n";
        }
        md += '\n';
        md += `## Missing Clauses\n`;
        if (analysis.missingClauses.length > 0) {
            analysis.missingClauses.forEach(clause => {
                md += `*   ${clause}\n`;
            });
        } else {
            md += "No critical missing clauses were identified.\n";
        }
        md += '\n';
        md += `## Suggested Fixes\n`;
        if (analysis.suggestedFixes.length > 0) {
            analysis.suggestedFixes.forEach(fix => {
                md += `*   ${fix}\n`;
            });
        } else {
            md += "No specific improvements were suggested.\n";
        }
        md += '\n';
        md += `## Key Dates & Obligations\n`;
        if (analysis.keyDates.length > 0) {
            analysis.keyDates.forEach(item => {
                md += `*   **${item.date}:** ${item.obligation}\n`;
            });
        } else {
            md += "No key dates were identified.\n";
        }
        return md;
    };

    const handleExport = async (format: 'word' | 'pdf') => {
        setIsExporting(true);
        const markdown = analysisToMarkdown();
        if (format === 'word') {
            await handleSaveAsWord(markdown);
        } else {
            // PDF export can be added here if needed, similar to original GeneratedDocument
        }
        setIsExporting(false);
    };

    const handleSaveAsWord = async (markdown: string) => {
        const htmlString = marked.parse(markdown);
        const parser = new DOMParser();
        const docHtml = parser.parseFromString(`<div>${htmlString}</div>`, 'text/html');
        
        // FIX: Replaced IBlockContent[] with Paragraph[]
        const processNode = (node: Node): Paragraph[] => {
            const blocks: Paragraph[] = [];
            if (node.nodeType !== Node.ELEMENT_NODE) return blocks;
            const element = node as HTMLElement;
            const tagName = element.tagName.toLowerCase();
            
            switch (tagName) {
                case 'h1': case 'h2': case 'h3':
                    blocks.push(new Paragraph({ text: element.textContent || '', heading: HeadingLevel.HEADING_2 }));
                    break;
                case 'p':
                    blocks.push(new Paragraph(element.textContent || ''));
                    break;
                case 'ul':
                    element.querySelectorAll(':scope > li').forEach(li => {
                        blocks.push(new Paragraph({ text: li.textContent || '', bullet: { level: 0 } }));
                    });
                    break;
                default:
                    element.childNodes.forEach(child => blocks.push(...processNode(child)));
            }
            return blocks;
        };

        // FIX: Replaced IBlockContent[] with Paragraph[]
        const docxChildren: Paragraph[] = Array.from(docHtml.body.firstChild?.childNodes || []).flatMap(processNode);
        
        const doc = new DocxDocument({
            sections: [{ children: docxChildren }]
        });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${document.name}-analysis.docx`);
    };

    return (
        <div className="space-y-6">
            <ResultCard title="Summary">
                <p>{analysis.summary}</p>
            </ResultCard>

            <ResultCard title={`Risks & Red Flags (${analysis.risks.length})`}>
                <ul className="space-y-4">
                    {analysis.risks.map((risk, i) => (
                        <li key={i} className="border-l-4 pl-4" style={{ borderColor: risk.severity === 'High' ? '#ef4444' : risk.severity === 'Medium' ? '#f59e0b' : '#22c55e' }}>
                            <div className="flex items-center gap-2 mb-1">
                                <SeverityBadge severity={risk.severity} />
                                <h4 className="font-semibold text-slate-800 dark:text-slate-100">{risk.description}</h4>
                            </div>
                            <blockquote className="text-sm text-slate-500 dark:text-slate-400 italic border-none p-0 m-0">
                                "{risk.snippet}"
                            </blockquote>
                        </li>
                    ))}
                </ul>
            </ResultCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResultCard title="Missing Clauses">
                    <ul className="list-disc list-inside space-y-1">
                        {analysis.missingClauses.map((clause, i) => <li key={i}>{clause}</li>)}
                    </ul>
                </ResultCard>
                <ResultCard title="Suggested Fixes">
                     <ul className="list-disc list-inside space-y-1">
                        {analysis.suggestedFixes.map((fix, i) => <li key={i}>{fix}</li>)}
                    </ul>
                </ResultCard>
            </div>
            
             <ResultCard title="Key Dates & Obligations">
                <ul className="space-y-2">
                    {analysis.keyDates.map((item, i) => (
                        <li key={i}><strong className="font-semibold">{item.date}:</strong> {item.obligation}</li>
                    ))}
                </ul>
            </ResultCard>

            <FeedbackCapture document={document} onUpdateDocument={onUpdateDocument} />

             <div className="flex-shrink-0 pt-4 flex flex-col sm:flex-row gap-2 justify-end">
                <button onClick={() => handleExport('word')} disabled={isExporting} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50">
                    <WordIcon className="w-4 h-4 mr-2" />
                    {isExporting ? 'Exporting...' : 'Save as Word'}
                </button>
                <button onClick={() => onCreateTemplate(document)} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                    <TemplateIcon className="w-4 h-4 mr-2" />
                    Create Template
                </button>
                <button onClick={onReset} className="px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-md hover:bg-slate-700">
                    Analyze Another
                </button>
            </div>
        </div>
    );
};

const ResultCard: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">{title}</h3>
        <div className="text-sm">{children}</div>
    </div>
);

const FeedbackCapture: React.FC<{ document: Document, onUpdateDocument: (doc: Document) => Promise<void> }> = ({ document, onUpdateDocument }) => {
    const [feedback, setFeedback] = useState<{useful: boolean | null, comment: string}>({ useful: null, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(document.feedback_is_useful !== null);

    const handleFeedbackSubmit = async () => {
        if (feedback.useful === null) return;
        setIsSubmitting(true);
        const updatedDoc: Document = {
            ...document,
            feedback_is_useful: feedback.useful,
            feedback_comment: feedback.comment || null,
        };
        try {
            await onUpdateDocument(updatedDoc);
            setFeedbackSubmitted(true);
        } catch (error) {
            console.error("Failed to submit feedback", error);
            // Optionally show an error to the user
        } finally {
            setIsSubmitting(false);
        }
    };

    if (feedbackSubmitted) {
        return (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700 text-center text-green-800 dark:text-green-200">
                <p>Thank you for your feedback!</p>
            </div>
        );
    }

    return (
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-center text-slate-700 dark:text-slate-200">Was this analysis useful?</h3>
            <div className="flex justify-center items-center gap-4 mt-3">
                <button 
                    onClick={() => setFeedback(f => ({...f, useful: true}))} 
                    className={`p-2 rounded-full transition-colors ${feedback.useful === true ? 'bg-green-200 dark:bg-green-500/30 text-green-700 dark:text-green-300' : 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500'}`}
                    aria-label="Analysis was useful"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-2.736 4.562M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                </button>
                <button 
                    onClick={() => setFeedback(f => ({...f, useful: false}))}
                    className={`p-2 rounded-full transition-colors ${feedback.useful === false ? 'bg-red-200 dark:bg-red-500/30 text-red-700 dark:text-red-300' : 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500'}`}
                    aria-label="Analysis was not useful"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.085a2 2 0 001.736-.97l2.736-4.562M17 4H19a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>
                </button>
            </div>
            {feedback.useful !== null && (
                <div className="mt-4 space-y-2">
                    <textarea 
                        value={feedback.comment}
                        onChange={(e) => setFeedback(f => ({...f, comment: e.target.value}))}
                        rows={2}
                        placeholder="Optional: Tell us more..."
                        className="w-full text-sm p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md"
                    />
                    <button 
                        onClick={handleFeedbackSubmit}
                        disabled={isSubmitting}
                        className="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-400"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AnalysisReport;