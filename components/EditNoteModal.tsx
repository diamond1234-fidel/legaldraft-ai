import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import Modal from './Modal';
import ErrorAlert from './ErrorAlert';

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => Promise<void>;
  note: Note;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ isOpen, onClose, onSave, note }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setContent(note.content);
            setError(null);
            setIsSaving(false);
        }
    }, [isOpen, note]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        try {
            await onSave({ ...note, content });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Note">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <ErrorAlert message={error} />}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
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

export default EditNoteModal;
