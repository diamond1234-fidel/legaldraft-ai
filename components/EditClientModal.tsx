import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import Modal from './Modal';
import ErrorAlert from './ErrorAlert';

// Re-usable components from other files
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:placeholder-slate-400 transition duration-150 input-field"
    />
  </div>
);
const RadioOption: React.FC<{ id: string, label: string, checked: boolean, onChange: () => void }> = ({ id, label, checked, onChange }) => (
    <div className="flex items-center">
        <input id={id} name="clientType" type="radio" checked={checked} onChange={onChange} className="h-4 w-4 text-blue-600 border-slate-300 dark:border-slate-500 focus:ring-blue-500" />
        <label htmlFor={id} className="ml-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
    </div>
);


interface EditClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: Client) => Promise<void>;
    client: Client;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onClose, onSave, client }) => {
    const [formData, setFormData] = useState<Client>(client);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(client);
            setError(null);
            setIsSaving(false);
        }
    }, [isOpen, client]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Client Details">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <ErrorAlert message={error} />}
                <InputField label="Client Name" name="name" value={formData.name} onChange={handleChange} required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Client Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required />
                    <InputField label="Client Phone" name="phone" value={formData.phone || ''} onChange={handleChange} />
                </div>
                <InputField label="Client Address" name="address" value={formData.address || ''} onChange={handleChange} />
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Client Type</label>
                    <div className="flex gap-4 mt-2">
                        <RadioOption id="edit-individual" label="Individual" checked={formData.type === 'Individual'} onChange={() => setFormData(f => ({...f, type: 'Individual'}))} />
                        <RadioOption id="edit-organization" label="Organization" checked={formData.type === 'Organization'} onChange={() => setFormData(f => ({...f, type: 'Organization'}))} />
                    </div>
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

export default EditClientModal;
