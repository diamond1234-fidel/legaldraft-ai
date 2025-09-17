import React, { useState } from 'react';
import Modal from './Modal';
import ErrorAlert from './ErrorAlert';
import UploadIcon from './icons/UploadIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, description: string) => Promise<void>;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ isOpen, onClose, onUpload }) => {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError(t('uploadSelectFileError'));
            return;
        }

        setIsUploading(true);
        setError(null);
        try {
            await onUpload(file, description);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : t('uploadErrorGeneral'));
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('uploadTitle')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <ErrorAlert message={error} />}
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t('uploadFile')}</label>
                    <div
                        onDrop={handleDrop}
                        onDragEnter={handleDragEvents}
                        onDragOver={handleDragEvents}
                        onDragLeave={handleDragEvents}
                        className={`w-full flex justify-center items-center px-4 py-10 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md transition-colors ${isDragging ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-slate-50 dark:bg-slate-700/50'}`}
                    >
                        <div className="text-center">
                            <UploadIcon className="w-10 h-10 text-slate-500 dark:text-slate-400 mx-auto" />
                            <label htmlFor="file-upload" className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{t('uploadBrowse')}</label>
                            <input id="file-upload" type="file" onChange={handleFileChange} className="sr-only" />
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('uploadOrDrag')}</p>
                            {file && <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{t('uploadSelected')}: {file.name}</p>}
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t('uploadDescription')}</label>
                    <input id="description" type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full input-field" placeholder={t('uploadDescriptionPlaceholder')} />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">{t('cancel')}</button>
                    <button type="submit" disabled={isUploading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-400">
                        {isUploading ? t('uploading') : t('uploadButton')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default UploadDocumentModal;
