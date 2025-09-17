

import React, { useRef, useState, useEffect } from 'react';
// FIX: Import the `Json` type to use for casting data sent to Supabase.
import { Document, Signatory, SignatureStatus, Json, SignatoryStatus } from '../types';
import { DISCLAIMER } from '../constants';
import WordIcon from './icons/WordIcon';
import PdfIcon from './icons/PdfIcon';
import SignatureIcon from './icons/SignatureIcon';
import TemplateIcon from './icons/TemplateIcon';
import ErrorAlert from './ErrorAlert';
import { sendForSignature, getSignatureStatus } from '../services/eSignatureService';
import ChevronDownIcon from './icons/ChevronDownIcon';
import TextIcon from './icons/TextIcon';
import ApiIcon from './icons/ApiIcon';


declare var jspdf: any;
declare var html2canvas: any;
declare var htmlToDocx: any;
declare var saveAs: any;
declare var marked: any;

interface GeneratedDocumentProps {
  document: Document;
  onUpdateDocument: (document: Document) => Promise<void>;
  onReset: () => void;
  onResetText?: string;
  onCreateTemplate?: (document: Document) => void;
}

const MenuItem: React.FC<{onClick: () => Promise<void>, icon: React.ReactNode, children: React.ReactNode}> = ({ onClick, icon, children }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center px-3 py-2 text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md"
    >
        {icon}
        {children}
    </button>
);

const GeneratedDocument: React.FC<GeneratedDocumentProps> = ({ document, onUpdateDocument, onReset, onResetText = 'Start New', onCreateTemplate }) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FIX: Use `signature_status` to align with the Document type from Supabase.
    if (document.signature_status === 'signed') {
        setDisclaimerAccepted(true);
    }
  }, [document]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    // FIX: The component `document` prop shadows the global `document` object. Use `window.document` to add the event listener to the DOM.
    window.document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // FIX: The component `document` prop shadows the global `document` object. Use `window.document` to remove the event listener from the DOM.
      window.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fullContent = `${document.content}\n\n---\n\n**Disclaimer:** *${DISCLAIMER}*`;

  const getParsedHtml = () => {
     if (typeof marked === 'undefined') {
        console.error('marked.js is not loaded');
        return '';
     }
     return marked.parse(fullContent);
  }

  const exportToDocx = async () => {
    setIsExporting(true);
    setExportError(null);
    if (!documentRef.current) return;
    try {
      const fileBuffer = await htmlToDocx(getParsedHtml());
      saveAs(fileBuffer, `${document.name || 'generated-document'}.docx`);
    } catch(e) {
      console.error("Error exporting to DOCX:", e);
      setExportError("There was an error exporting to Word. Please try again.");
    } finally {
      setIsExporting(false);
      setIsExportMenuOpen(false);
    }
  };

  const exportToPdf = async () => {
    setIsExporting(true);
    setExportError(null);
    if (!documentRef.current) {
        setIsExporting(false);
        return;
    };

    try {
      const isDarkMode = window.document.documentElement.classList.contains('dark');
      const { jsPDF } = jspdf;
      const canvas = await html2canvas(documentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`${document.name || 'generated-document'}.pdf`);
    } catch (e) {
      console.error("Error exporting to PDF:", e);
      setExportError("There was an error exporting to PDF. Please try again.");
    } finally {
      setIsExporting(false);
      setIsExportMenuOpen(false);
    }
  };

  const exportAsHtml = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const htmlContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${document.name || 'Document'}</title><style>body { font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 2rem auto; padding: 0 1rem; } img { max-width: 100%; height: auto; }</style></head><body>${getParsedHtml()}</body></html>`;
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      saveAs(blob, `${document.name || 'document'}.html`);
    } catch (e) {
      console.error("Error exporting to HTML:", e);
      setExportError("There was an error exporting to Rich Text (.html).");
    } finally {
      setIsExporting(false);
      setIsExportMenuOpen(false);
    }
  };

  const exportAsPlainText = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const blob = new Blob([document.content || ''], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${document.name || 'document'}.txt`);
    } catch (e) {
      console.error("Error exporting to TXT:", e);
      setExportError("There was an error exporting to Plain Text (.txt).");
    } finally {
      setIsExporting(false);
      setIsExportMenuOpen(false);
    }
  };
  
  const isExportDisabled = isExporting || !disclaimerAccepted;

  return (
    <div>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div ref={exportMenuRef} className="relative flex-1">
                <button 
                    onClick={() => setIsExportMenuOpen(prev => !prev)} 
                    disabled={isExportDisabled} 
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    aria-haspopup="true"
                    aria-expanded={isExportMenuOpen}
                >
                    {isExporting ? 'Exporting...' : 'Export Document'}
                    <ChevronDownIcon className={`w-5 h-5 ml-2 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isExportMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-lg z-10 p-1">
                        <MenuItem onClick={exportToPdf} icon={<PdfIcon className="h-5 w-5 mr-3 text-red-500" />}>Export as PDF</MenuItem>
                        <MenuItem onClick={exportToDocx} icon={<WordIcon className="h-5 w-5 mr-3 text-blue-500" />}>Export as Word (.docx)</MenuItem>
                        <MenuItem onClick={exportAsHtml} icon={<ApiIcon className="h-5 w-5 mr-3 text-orange-500" />}>Export as Rich Text (.html)</MenuItem>
                        <MenuItem onClick={exportAsPlainText} icon={<TextIcon className="h-5 w-5 mr-3 text-slate-500" />}>Export as Plain Text (.txt)</MenuItem>
                    </div>
                )}
            </div>
            
            {onCreateTemplate && (
              <button onClick={() => onCreateTemplate(document)} className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700">
                <TemplateIcon className="h-5 w-5 mr-2" />
                Save as Template
              </button>
            )}
        </div>

        {exportError && <div className="my-2"><ErrorAlert message={exportError} title="Export Failed" /></div>}

        <ESignaturePanel document={document} onUpdateDocument={onUpdateDocument} />

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-3 my-4">
            <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                    <input id="disclaimer-checkbox" type="checkbox" checked={disclaimerAccepted} onChange={(e) => setDisclaimerAccepted(e.target.checked)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-600" />
                </div>
                <div className="ml-3 text-sm leading-6">
                    <label htmlFor="disclaimer-checkbox" className="font-medium text-yellow-800 dark:text-yellow-200">Acknowledge Disclaimer to Export</label>
                    <p className="text-yellow-700 dark:text-yellow-300/80">I understand this document is AI-generated and not legal advice.</p>
                </div>
            </div>
        </div>
      
        <div ref={documentRef} className="prose prose-slate dark:prose-invert max-w-none p-4 border border-slate-200 dark:border-slate-700 rounded-md h-[60vh] overflow-y-auto bg-slate-50 dark:bg-slate-800" dangerouslySetInnerHTML={{ __html: getParsedHtml() }}></div>
      
        <button onClick={onReset} className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-700">
            {onResetText}
        </button>
    </div>
  );
};

const ESignaturePanel: React.FC<{document: Document, onUpdateDocument: (doc: Document) => Promise<void>}> = ({ document, onUpdateDocument }) => {
    const [signatories, setSignatories] = useState<Omit<Signatory, 'status'>[]>([]);
    const [signerName, setSignerName] = useState('');
    const [signerEmail, setSignerEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (document.signature_status === 'none' && Array.isArray(document.signatories)) {
            setSignatories(document.signatories as unknown as Omit<Signatory, 'status'>[]);
        }
    }, [document.signatories, document.signature_status]);

    const handleAddSignatory = () => {
        if (signerName.trim() && signerEmail.trim()) {
            setSignatories([...signatories, { name: signerName, email: signerEmail }]);
            setSignerName('');
            setSignerEmail('');
        }
    };

    const handleSendForSignature = async () => {
        if (signatories.length === 0) return;
        setIsSending(true);
        setError(null);
        try {
            const { signatureRequestId } = await sendForSignature(document.content || '', signatories, document.id, document.user_id);
            
            const updatedDoc: Document = {
                 ...document,
                 signature_request_id: signatureRequestId,
                 signature_status: 'out_for_signature', 
                 signatories: signatories.map(s => ({ ...s, status: 'pending' })) as unknown as Json
            };
            await onUpdateDocument(updatedDoc);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to send for signature.');
        } finally {
            setIsSending(false);
        }
    };
    
    const handleRefreshStatus = async () => {
        if (!document.signature_request_id) return;
        setIsRefreshing(true);
        setError(null);
        try {
            const { status, signatories: updatedSignatories } = await getSignatureStatus(document.signature_request_id);
            const updatedDoc = {
                ...document,
                signature_status: status,
                signatories: updatedSignatories as unknown as Json
            };
            await onUpdateDocument(updatedDoc);
        } catch(e) {
            setError(e instanceof Error ? e.message : 'Failed to refresh signature status.');
        } finally {
            setIsRefreshing(false);
        }
    };


    if (document.signature_status !== 'none') {
        return (
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 mb-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center"><SignatureIcon className="w-5 h-5 mr-2 text-blue-500" />E-Signature Status</h3>
                    {document.signature_status === 'out_for_signature' && (
                        <button onClick={handleRefreshStatus} disabled={isRefreshing} className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/60 disabled:bg-slate-200 disabled:text-slate-500 transition-colors">
                            {isRefreshing ? 'Refreshing...' : 'Refresh Status'}
                        </button>
                    )}
                </div>
                {error && <div className="mt-2"><ErrorAlert message={error} title="Update Failed" /></div>}
                <div className="mt-2 text-sm space-y-2">
                    {(Array.isArray(document.signatories) ? (document.signatories as unknown as Signatory[]) : []).map((s, i) => (
                        <div key={i} className="flex justify-between items-center py-1">
                            <span className="text-slate-600 dark:text-slate-300">{s.name} ({s.email})</span>
                             <SignatureStatusBadge status={s.status} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 mb-4 space-y-3">
             <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center"><SignatureIcon className="w-5 h-5 mr-2" />Send for E-Signature</h3>
             {error && <ErrorAlert message={error} title="Request Failed" />}
             {signatories.map((s, i) => (
                 <div key={i} className="text-sm bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md flex justify-between items-center">
                     <span>{s.name} ({s.email})</span>
                     <button onClick={() => setSignatories(signatories.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-red-500">×</button>
                 </div>
             ))}
             <div className="flex gap-2 items-end">
                 <div className="flex-grow">
                     <label className="text-xs text-slate-500">Signatory Name</label>
                     <input type="text" value={signerName} onChange={e => setSignerName(e.target.value)} placeholder="Jane Doe" className="w-full text-sm px-2 py-1 border border-slate-300 dark:border-slate-600 rounded" />
                 </div>
                 <div className="flex-grow">
                     <label className="text-xs text-slate-500">Signatory Email</label>
                     <input type="email" value={signerEmail} onChange={e => setSignerEmail(e.target.value)} placeholder="jane@example.com" className="w-full text-sm px-2 py-1 border border-slate-300 dark:border-slate-600 rounded" />
                 </div>
                 <button onClick={handleAddSignatory} className="px-3 py-1 text-sm border rounded-md bg-white dark:bg-slate-600 hover:bg-slate-100 dark:hover:bg-slate-500">+</button>
             </div>
             <button onClick={handleSendForSignature} disabled={isSending || signatories.length === 0} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400">
                {isSending ? 'Sending...' : `Send for Signature to ${signatories.length} recipient(s)`}
             </button>
        </div>
    );
};

const SignatureStatusBadge: React.FC<{ status: SignatureStatus | SignatoryStatus }> = ({ status }) => {
  const styles: Record<string, string> = {
    none: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    out_for_signature: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
    signed: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
    declined: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    pending: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
  };
  const text: Record<string, string> = {
    none: 'Not Sent',
    out_for_signature: 'Out for Signature',
    signed: 'Signed',
    declined: 'Declined',
    pending: 'Pending',
  };
  return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || styles.none}`}>{text[status] || 'Unknown'}</span>;
};


export default GeneratedDocument;