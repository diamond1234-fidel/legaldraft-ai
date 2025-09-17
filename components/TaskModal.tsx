
import React, { useState, useEffect } from 'react';
import { Task, Matter } from '../types';
import Modal from './Modal';
import ErrorAlert from './ErrorAlert';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'created_at' | 'user_id'> | Omit<Task, 'created_at' | 'user_id'>) => Promise<void>;
  taskToEdit?: Task | null;
  matters: Matter[];
  matterId?: string; // Pre-selected matter for context-specific creation
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit, matters, matterId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMatterId, setSelectedMatterId] = useState(matterId || '');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || '');
        setSelectedMatterId(taskToEdit.matter_id);
        setDueDate(taskToEdit.due_date ? taskToEdit.due_date.split('T')[0] : '');
        setStatus(taskToEdit.status);
      } else {
        // Reset form for new task
        setTitle('');
        setDescription('');
        setSelectedMatterId(matterId || (matters.length > 0 ? matters[0].id : ''));
        setDueDate('');
        setStatus('pending');
      }
      setError(null);
      setIsSaving(false);
    }
  }, [taskToEdit, isOpen, matters, matterId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedMatterId) {
      setError("Title and associated matter are required.");
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    const taskData = {
        title,
        description,
        matter_id: selectedMatterId,
        due_date: dueDate || null,
        status,
    };

    try {
        if (taskToEdit) {
            await onSave({ ...taskData, id: taskToEdit.id });
        } else {
            await onSave(taskData);
        }
        onClose();
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={taskToEdit ? 'Edit Task' : 'Add New Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorAlert message={error} />}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Title</label>
          <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full input-field" placeholder="e.g., File motion to compel" />
        </div>
        <div>
          <label htmlFor="matter" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Associated Matter</label>
          <select id="matter" value={selectedMatterId} onChange={e => setSelectedMatterId(e.target.value)} required className="w-full input-field" disabled={!!matterId}>
            <option value="" disabled>-- Select a matter --</option>
            {matters.map(m => (
              <option key={m.id} value={m.id}>{m.matter_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description (Optional)</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full input-field" placeholder="Add more details about the task..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Due Date</label>
            <input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full input-field" />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Status</label>
            <select id="status" value={status} onChange={e => setStatus(e.target.value as 'pending' | 'completed')} className="w-full input-field">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">Cancel</button>
          <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-400">
            {isSaving ? 'Saving...' : 'Save Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
