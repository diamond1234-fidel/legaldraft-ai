import React, { useState, useRef } from 'react';
import { Page, Document, ContractAnalysis } from '../types';
import { US_JURISDICTIONS } from '../constants';
import AnalysisReport from './GeneratedDocument'; // Renamed, but keeping the file name for simplicity
import { analyzeContract } from '../services/geminiService';
import UploadIcon from './icons/UploadIcon';
import ErrorAlert from './ErrorAlert';
import ReviewLoadingState from './ReviewLoadingState';
import TextIcon from './icons/TextIcon';
import * as pdfjsLib from 'pdfjs-dist';
import CameraIcon from './icons/CameraIcon';

// mammoth.js and Tesseract.js are loaded from script tags in index.html
declare var mammoth: any;
declare var Tesseract: any;

interface ReviewContractPageProps {
    isUsageLimitReached: boolean;
    onNavigate: (page: Page) => void;
    addDocument: (docData: Omit<Document, 'id' | 'created_at' | 'user_id' | 'version_history'>) => Promise<Document>;
    updateDocument: (doc: Document) => Promise<void>;
}

const ReviewContractPage: React.FC<ReviewContractPageProps> = ({ isUsageLimitReached, onNavigate, addDocument, updateDocument }) => {
    const [inputType, setInputType] = useState<'upload' | 'paste'>('upload');
    const [contractFiles, setContractFiles] = useState<File[]>([]);
    const [pastedText, setPastedText] = useState('');
    const [jurisdiction, setJurisdiction] = useState(US_JURISDICTIONS[0].value);
    const [analysisResult, setAnalysisResult] = useState<ContractAnalysis | null>(null);
    const [savedDocument, setSavedDocument] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState<{ processed: number; total: number; currentFile: string; } | null>(null);
    const [ocrProgress, setOcrProgress] = useState<{ status: string; progress: number } | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const readFileAsText = async (file: File): Promise<string> => {
        if (file.type.startsWith('image/')) {
            if (typeof Tesseract === 'undefined') {
                throw new Error("OCR library (Tesseract.js) is not loaded. Please check your internet connection and refresh.");
            }
            
            setOcrProgress({ status: 'Initializing OCR worker...', progress: 0 });
            
            const worker = await Tesseract.createWorker('eng', 1, {
                logger: (m: any) => {
                    setOcrProgress({ status: m.status, progress: m.progress });
                },
            });
            
            try {
                const { data: { text } } = await worker.recognize(file);
                return text;
            } finally {
                await worker.terminate();
                setOcrProgress(null);
            }
        } else if (file.type === 'application/pdf') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.5.136/build/pdf.worker.mjs`;
            
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
            }
            return fullText;
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { // DOCX
            if (!mammoth) throw new Error("DOCX parsing library (mammoth.js) is not loaded.");
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
            return result.value;
        } else if (file.type.startsWith('text/')) {
            return file.text();
        } else {
            throw new Error(`Unsupported file type: ${file.type}. Please upload a PDF, DOCX, TXT, or Image file.`);
        }
    };

    const handleAnalyze = async () => {
        if (isUsageLimitReached) return;
        
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        setSavedDocument(null);
        
        try {
            if (inputType === 'upload' && contractFiles.length > 0) {
                 // Batch processing for multiple files
                if (contractFiles.length > 1) {
                    setAnalysisProgress({ processed: 0, total: contractFiles.length, currentFile: contractFiles[0].name });

                    for (let i = 0; i < contractFiles.length; i++) {
                        const file = contractFiles[i];
                        setAnalysisProgress(prev => ({ ...prev!, processed: i, currentFile: file.name }));
                        const contractText = await readFileAsText(file);
                        const analysis = await analyzeContract(contractText, jurisdiction);
                        await addDocument({
                            name: file.name,
                            type: 'Contract Analysis',
                            state: jurisdiction,
                            status: 'analyzed',
                            content: JSON.stringify(analysis),
                            source: 'uploaded',
                            file_url: null, health_score: null, matter_id: null, signature_request_id: null, signatories: null, feedback_comment: null, feedback_is_useful: null
                        });
                        setAnalysisProgress(prev => ({ ...prev!, processed: i + 1, currentFile: file.name }));
                    }
                    onNavigate('documents');
                } else { // Single file upload
                    const contractFile = contractFiles[0];
                    const contractText = await readFileAsText(contractFile);
                    const analysis = await analyzeContract(contractText, jurisdiction);
                    setAnalysisResult(analysis);
                    
                    const finalDoc = await addDocument({
                        name: contractFile.name, type: 'Contract Analysis', state: jurisdiction, status: 'analyzed', content: JSON.stringify(analysis), source: 'uploaded',
                        file_url: null, health_score: null, matter_id: null, signature_request_id: null, signatories: null, feedback_comment: null, feedback_is_useful: null,
                    });
                    setSavedDocument(finalDoc);
                }
            } else if (inputType === 'paste' && pastedText.trim()) {
                const contractText = pastedText;
                const documentName = `Pasted Contract - ${new Date().toLocaleDateString()}`;
                const analysis = await analyzeContract(contractText, jurisdiction);
                setAnalysisResult(analysis);
                
                const finalDoc = await addDocument({
                    name: documentName, type: 'Contract Analysis', state: jurisdiction, status: 'analyzed', content: JSON.stringify(analysis), source: 'uploaded',
                    file_url: null, health_score: null, matter_id: null, signature_request_id: null, signatories: null, feedback_comment: null, feedback_is_useful: null,
                });
                setSavedDocument(finalDoc);
            } else {
                throw new Error("Please upload a file or paste contract text.");
            }

        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(msg);
        } finally {
            setIsLoading(false);
            setAnalysisProgress(null);
            // Don't reset single file uploads so user can see it
            if (contractFiles.length > 1) {
                setContractFiles([]);
            }
        }
    };

    const handleReset = () => {
        setAnalysisResult(null);
        setSavedDocument(null);
        setError(null);
        setContractFiles([]);
        setPastedText('');
    };

    const handleFilesSelected = (files: FileList | null) => {
        if (files) {
            setContractFiles(Array.from(files));
            setError(null);
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFilesSelected(event.target.files);
    };
    
    const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesSelected(e.dataTransfer.files);
        }
    };
    
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraOpen(true);
        } catch (err) {
            setError("Could not access camera. Please ensure permissions are granted in your browser settings.");
            console.error("Camera error:", err);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
    };

    const captureImage = () => {
        const video = videoRef.current;
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                if (blob) {
                    const file = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
                    setContractFiles([file]);
                    stopCamera();
                }
            }, 'image/png');
        }
    };
    
    if (isUsageLimitReached) {
        return (
            <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Trial Usage Limit Reached</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">You have used all 5 of your free contract analyses.</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Please upgrade your plan to continue analyzing documents.</p>
                <button 
                    onClick={() => onNavigate('billing')}
                    className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700"
                >
                    View Plans
                </button>
            </div>
        )
    }

    if (isLoading) return <ReviewLoadingState progress={analysisProgress} ocrProgress={ocrProgress} />;
    if (analysisResult && savedDocument) {
        return <AnalysisReport 
                    analysis={analysisResult} 
                    document={savedDocument}
                    onReset={handleReset} 
                    onCreateTemplate={() => { /* Not implemented in MVP */}} 
                    onUpdateDocument={updateDocument}
                />;
    }
    
    const isAnalyzeDisabled = inputType === 'upload' ? contractFiles.length === 0 : !pastedText.trim();

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">AI Contract Review</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Upload a contract or paste text to get an instant analysis of risks, missing clauses, and more.</p>
                </div>

                {error && <ErrorAlert message={error} />}

                <div>
                    <label htmlFor="jurisdiction" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">State/Jurisdiction of Contract</label>
                    <select id="jurisdiction" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        {US_JURISDICTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                </div>
                
                <div>
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex rounded-md shadow-sm bg-slate-100 dark:bg-slate-700 p-1">
                             <button 
                                onClick={() => { setInputType('upload'); setIsCameraOpen(false); }} 
                                className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${inputType === 'upload' && !isCameraOpen ? 'bg-white dark:bg-slate-600 shadow text-blue-600' : 'text-slate-600 dark:text-slate-300'}`}
                            >
                                <UploadIcon className="w-4 h-4 mr-2" />
                                Upload File
                            </button>
                            <button 
                                onClick={() => { setInputType('upload'); startCamera(); }} 
                                className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${isCameraOpen ? 'bg-white dark:bg-slate-600 shadow text-blue-600' : 'text-slate-600 dark:text-slate-300'}`}
                            >
                                <CameraIcon className="w-4 h-4 mr-2" />
                                Use Camera
                            </button>
                            <button 
                                onClick={() => { setInputType('paste'); stopCamera(); }} 
                                className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${inputType === 'paste' ? 'bg-white dark:bg-slate-600 shadow text-blue-600' : 'text-slate-600 dark:text-slate-300'}`}
                            >
                                <TextIcon className="w-4 h-4 mr-2" />
                                Paste Text
                            </button>
                        </div>
                    </div>

                    {inputType === 'upload' ? (
                        isCameraOpen ? (
                             <div className="bg-slate-800 rounded-lg overflow-hidden relative">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-center items-center gap-4">
                                    <button onClick={stopCamera} className="px-4 py-2 text-sm font-medium bg-white/20 text-white rounded-md backdrop-blur-sm hover:bg-white/30">Cancel</button>
                                    <button onClick={captureImage} className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg transform active:scale-95">
                                        <div className="w-14 h-14 rounded-full border-2 border-slate-800"></div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label 
                                    htmlFor="contract-file-upload" 
                                    onDrop={handleDrop}
                                    onDragEnter={handleDragEvents}
                                    onDragOver={handleDragEvents}
                                    onDragLeave={handleDragEvents}
                                    className={`w-full flex justify-center items-center px-4 py-10 border-2 border-dashed rounded-md cursor-pointer transition-colors ${isDragging ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500' : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                    <div className="text-center">
                                        <UploadIcon className="w-10 h-10 text-slate-500 dark:text-slate-400 mx-auto" />
                                        {contractFiles.length > 0 ? (
                                            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 text-left max-w-full overflow-hidden">
                                                <p className="font-semibold mb-1 text-center">Selected file(s):</p>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {contractFiles.map(file => (
                                                        <li key={file.name} className="truncate" title={file.name}>{file.name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="mt-2 block font-medium text-slate-600 dark:text-slate-300">
                                                    Upload one or more PDF, DOCX, TXT, or Image files
                                                </span>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">or drag and drop</p>
                                            </>
                                        )}
                                    </div>
                                </label>
                                <input id="contract-file-upload" type="file" multiple className="sr-only" onChange={handleFileChange} accept=".pdf,.docx,.txt,image/*" />
                            </div>
                        )
                    ) : (
                        <div>
                             <textarea 
                                value={pastedText}
                                onChange={(e) => setPastedText(e.target.value)}
                                rows={10}
                                placeholder="Paste the full text of your contract here..."
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}
                </div>

                <button type="button" onClick={handleAnalyze} disabled={isAnalyzeDisabled} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400">
                    Analyze Contract{contractFiles.length > 1 ? 's' : ''}
                </button>
            </div>
        </div>
    );
};

export default ReviewContractPage;