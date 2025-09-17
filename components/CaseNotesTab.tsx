import React, { useState } from 'react';
import { Note, Matter } from '../types';
import ErrorAlert from './ErrorAlert';
import EditNoteModal from './EditNoteModal';

interface CaseNotesTabProps {
    matter: Matter;
    notes: Note[];
    addNote: (noteData: Omit<Note, 'id' | 'created_at' | 'user_id'>) => Promise<Note>;
    onUpdateNote: (note: Note) => Promise<void>;
    onDeleteNote: (noteId: string) => Promise<void>;
}

const CaseNotesTab: React.FC<CaseNotesTabProps> = ({ matter, notes, addNote, onUpdateNote, onDeleteNote }) => {
    const [newNote, setNewNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        setIsSaving(true);
        setError(null);
        try {
            await addNote({
                matter_id: matter.id,
                content: newNote,
            });
            setNewNote(''); // Clear the textarea on successful save
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save note.');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDelete = async (noteId: string) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            setError(null);
            try {
                await onDeleteNote(noteId);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete note.');
            }
        }
    };

    // Filtering out the AI-generated client updates from the notes list
    const userNotes = notes.filter(note => !note.content.startsWith('--- AI-Generated Client Update ---'))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Add a New Note</h3>
                <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                     {error && <ErrorAlert message={error} title="Error" />}
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={4}
                        placeholder="Type your case note here..."
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:placeholder-slate-400 transition duration-150"
                        disabled={isSaving}
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving || !newNote.trim()}
                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving...' : 'Save Note'}
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Note History</h3>
                 {userNotes.length > 0 ? (
                    <ul className="space-y-4">
                        {userNotes.map(note => (
                            <li key={note.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{note.content}</p>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex justify-between items-center">
                                    <span>{new Date(note.created_at).toLocaleString()}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingNote(note)} className="font-medium text-blue-600 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(note.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <p>No notes have been added for this matter yet.</p>
                    </div>
                 )}
            </div>
            {editingNote && (
                <EditNoteModal 
                    isOpen={!!editingNote}
                    onClose={() => setEditingNote(null)}
                    onSave={onUpdateNote}
                    note={editingNote}
                />
            )}
        </div>
    );
};

export default CaseNotesTab;