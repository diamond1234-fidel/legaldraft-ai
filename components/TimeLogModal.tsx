import React, { useState, useEffect } from 'react';
import { TimeEntry, Matter } from '../types';
import Modal from './Modal';
import ErrorAlert from './ErrorAlert';
import { useLanguage } from '../contexts/LanguageContext';

interface TimeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<TimeEntry, 'id' | 'created_at' | 'user_id' | 'is_billed'> | Omit<TimeEntry, 'created_at' | 'user_id'>) => Promise<void>;
  matter: Matter;
  entryToEdit?: TimeEntry | null;
}

const TimeLogModal: React.FC<TimeLogModalProps> = ({ isOpen, onClose, onSave, matter, entryToEdit }) => {
    const { t } = useLanguage();
    const [hours, setHours] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (entryToEdit) {
                setHours(String(entryToEdit.hours));
                setDate(entryToEdit.date.split('T')[0]);
                setDescription(entryToEdit.description || '');
            } else {
                setHours('');
                setDate(new Date().toISOString().split('T')[0]);
                setDescription('');
            }
            setError(null);
            setIsSaving(false);
        }
    }, [isOpen, entryToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const hoursNum = parseFloat(hours);
        if (isNaN(hoursNum) || hoursNum <= 0) {
            setError(t('timeLogError'));
            return;
        }

        setIsSaving(true);
        setError(null);

        const entryData = {
            matter_id: matter.id,
            hours: hoursNum,
            date,
            description,
        };

        try {
             if (entryToEdit) {
                await onSave({ ...entryData, id: entryToEdit.id, is_billed: entryToEdit.is_billed });
            } else {
                await onSave(entryData);
            }
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : t('timeLogErrorGeneral'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${entryToEdit ? 'Edit' : 'Log'} Time for ${matter.matter_name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <ErrorAlert message={error} />}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="hours" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t('timeLogHours')}</label>
                        <input id="hours" type="number" step="0.1" value={hours} onChange={e => setHours(e.target.value)} required className="w-full input-field" placeholder="e.g., 1.5" />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t('timeLogDate')}</label>
                        <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full input-field" />
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t('timeLogDescription')}</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full input-field" placeholder={t('timeLogPlaceholder')} />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">{t('cancel')}</button>
                    <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-400">
                        {isSaving ? t('saving') : (entryToEdit ? 'Save Changes' : t('timeLogSave'))}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default TimeLogModal;