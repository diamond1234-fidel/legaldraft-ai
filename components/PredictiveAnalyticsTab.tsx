
import React, { useState } from 'react';
import { JURISDICTIONS } from '../constants';
import { predictMotionOutcome } from '../services/geminiService';
import { PredictiveAnalyticsResult } from '../types';
import ErrorAlert from './ErrorAlert';
import TrendingUpIcon from './icons/TrendingUpIcon';
import ConfidenceMeter from './ConfidenceMeter';

const LoadingState: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">Running Predictive Analysis...</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Analyzing historical data and precedents...</p>
    </div>
);

const PredictiveAnalyticsTab: React.FC = () => {
    const [motionType, setMotionType] = useState('');
    const [jurisdiction, setJurisdiction] = useState(JURISDICTIONS[0].value);
    const [myArgument, setMyArgument] = useState('');
    const [opposingArgument, setOpposingArgument] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PredictiveAnalyticsResult | null>(null);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await predictMotionOutcome(motionType, jurisdiction, myArgument, opposingArgument);
            setResult(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred during analysis.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <LoadingState />;
    if (result) return <ResultsDisplay result={result} onNewAnalysis={() => setResult(null)} />;

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-center text-slate-700 dark:text-slate-200">Predictive Case Analytics</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mt-1 max-w-2xl mx-auto">
                Predict outcomes of motions based on prior court decisions. Suggest optimal strategies or risk level.
            </p>
            <form onSubmit={handleAnalyze} className="mt-8 max-w-3xl mx-auto space-y-4">
                {error && <ErrorAlert message={error} />}
                <InputField id="motionType" label="Motion Type" value={motionType} onChange={e => setMotionType(e.target.value)} placeholder="e.g., Motion for Summary Judgment" required />
                <div>
                    <label htmlFor="jurisdiction" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Jurisdiction</label>
                    <select id="jurisdiction" value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} className="w-full input-field">
                        {JURISDICTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                <TextAreaField id="myArgument" label="Summary of Your Argument" value={myArgument} onChange={e => setMyArgument(e.target.value)} placeholder="Briefly outline the key points of your argument." rows={4} required />
                <TextAreaField id="opposingArgument" label="Summary of Opposing Argument (if known)" value={opposingArgument} onChange={e => setOpposingArgument(e.target.value)} placeholder="Briefly outline the key points of the opposition's argument." rows={4} />

                <button type="submit" disabled={isLoading || !motionType.trim() || !myArgument.trim()} className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400">
                    <TrendingUpIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Analyzing...' : 'Predict Outcome'}
                </button>
            </form>
        </div>
    );
};

const ResultsDisplay: React.FC<{result: PredictiveAnalyticsResult, onNewAnalysis: () => void}> = ({ result, onNewAnalysis }) => {
    const mapPredictionToOutcome = (prediction: PredictiveAnalyticsResult['prediction']): 'Likely to be Granted' | 'Likely to be Denied' | 'Uncertain' => {
        switch (prediction) {
            case 'PlaintiffLikely': return 'Likely to be Granted';
            case 'DefendantLikely': return 'Likely to be Denied';
            case 'Uncertain': return 'Uncertain';
            default: return 'Uncertain';
        }
    };
    
    const RiskBadge: React.FC<{level: 'Low' | 'Medium' | 'High'}> = ({ level }) => {
        const config = {
            Low: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
            Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
            High: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config[level]}`}>{level} Risk</span>;
    };
    
    const formatStrategy = (text: string) => {
        const points = text.split('\n').filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
        if (points.length > 1) {
            return (
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    {points.map((point, i) => <li key={i}>{point.substring(point.indexOf(' ')+1)}</li>)}
                </ul>
            );
        }
        return <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{text}</p>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Analysis Results</h2>
                <button onClick={onNewAnalysis} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    New Analysis
                </button>
            </div>
            
            <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                 <ConfidenceMeter score={result.confidence} outcome={mapPredictionToOutcome(result.prediction)} />
                 <div className="mt-4 flex justify-center items-center gap-4">
                    <RiskBadge level={result.riskLevel} />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Based on {result.rawCasesFetched} case(s) fetched from CourtListener.
                    </p>
                 </div>
            </div>
            
            <ResultCard title="Recommended Strategy">
                {formatStrategy(result.recommendedStrategy)}
            </ResultCard>

            <ResultCard title="Supporting Cases">
                {result.supportingCases.length > 0 ? (
                    <ul className="space-y-4">
                        {result.supportingCases.map((p, i) => (
                            <li key={i} className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{p.caseName} ({p.citation})</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 italic mt-1">"{p.reasoning}"</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No specific supporting cases were identified by the AI.</p>
                )}
            </ResultCard>
        </div>
    );
};


const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <input {...props} className="w-full input-field" />
  </div>
);

const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <textarea {...props} className="w-full input-field" />
  </div>
);

const ResultCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">{title}</h3>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            {children}
        </div>
    </div>
);


export default PredictiveAnalyticsTab;