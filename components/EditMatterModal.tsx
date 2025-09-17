import React, { useState, useEffect } from 'react';
import { Matter, OpposingParty, Json } from '../types';
import Modal from './Modal';
import ErrorAlert from './ErrorAlert';

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:placeholder-slate-400 transition duration-150 input-field"
    />
  </div>
);

interface EditMatterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (matter: Matter) => Promise<void>;
    matter: Matter;
}

const EditMatterModal: React.FC<EditMatterModalProps> = ({ isOpen, onClose, onSave, matter }) => {
    const [matterName, setMatterName] = useState('');
    const [opposingParties, setOpposingParties] = useState<OpposingParty[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMatterName(matter.matter_name);
            setOpposingParties((matter.opposing_parties as unknown as OpposingParty[] | null) || [{ name: '', counsel: '' }]);
            setError(null);
            setIsSaving(false);
        }
    }, [isOpen, matter]);
    
    const handleAddParty = () => setOpposingParties([...opposingParties, { name: '', counsel: '' }]);
    const handlePartyChange = (index: number, field: keyof OpposingParty, value: string) => {
        const newParties = [...opposingParties];
        newParties[index][field] = value;
        setOpposingParties(newParties);
    };
    const handleRemoveParty = (index: number) => setOpposingParties(opposingParties.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        try {
            const updatedMatter = {
                ...matter,
                matter_name: matterName,
                opposing_parties: opposingParties.filter(p => p.name.trim()) as unknown as Json,
            };
            await onSave(updatedMatter);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Matter Details">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <ErrorAlert message={error} />}
                <InputField label="Matter Name" value={matterName} onChange={e => setMatterName(e.target.value)} required />
                
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Opposing Parties</h3>
                    {opposingParties.map((party, index) => (
                        <div key={index} className="flex items-end gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                <InputField label={`Opposing Party ${index + 1} Name`} value={party.name} onChange={e => handlePartyChange(index, 'name', e.target.value)} />
                                <InputField label="Counsel (if known)" value={party.counsel} onChange={e => handlePartyChange(index, 'counsel', e.target.value)} />
                            </div>
                            <button type="button" onClick={() => handleRemoveParty(index)} className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddParty} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">+ Add another party</button>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">Cancel</button>
                    <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-400">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditMatterModal;
