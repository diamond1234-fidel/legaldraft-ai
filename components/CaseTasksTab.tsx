
import React, { useState, useMemo } from 'react';
import { Task, Matter } from '../types';
import TaskModal from './TaskModal';
import TasksIcon from './icons/TasksIcon';
import ErrorAlert from './ErrorAlert';

interface CaseTasksTabProps {
    matter: Matter;
    tasks: Task[];
    onAddTask: (taskData: Omit<Task, 'id' | 'created_at' | 'user_id'>) => Promise<Task>;
    onUpdateTask: (taskData: Omit<Task, 'created_at' | 'user_id'>) => Promise<void>;
    onDeleteTask: (taskId: string) => Promise<void>;
}

const CaseTasksTab: React.FC<CaseTasksTabProps> = ({ matter, tasks, onAddTask, onUpdateTask, onDeleteTask }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [toggledTaskId, setToggledTaskId] = useState<string | null>(null); // For animation

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            if (a.status === b.status) {
                return (new Date(a.due_date || 0).getTime()) - (new Date(b.due_date || 0).getTime());
            }
            return a.status === 'pending' ? -1 : 1;
        });
    }, [tasks]);

    const handleOpenModalForEdit = (task: Task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleOpenModalForNew = () => {
        setTaskToEdit(null);
        setIsModalOpen(true);
    };

    const handleSaveTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'user_id'> | Omit<Task, 'created_at' | 'user_id'>) => {
        setError(null);
        try {
            if ('id' in taskData) {
                await onUpdateTask(taskData);
            } else {
                await onAddTask(taskData);
            }
        } catch (e) {
            throw e;
        }
    };
    
    const handleDelete = async (task: Task) => {
        setError(null);
        if (window.confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
            try {
                await onDeleteTask(task.id);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
            }
        }
    };

    const handleToggleStatus = async (task: Task) => {
        setError(null);
        const updatedTask = { ...task, status: task.status === 'pending' ? 'completed' : 'pending' } as Omit<Task, 'created_at' | 'user_id'>;
        try {
            await onUpdateTask(updatedTask);
            setToggledTaskId(task.id);
            setTimeout(() => {
                setToggledTaskId(null);
            }, 500); // Animation duration
        } catch (e) {
             setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button onClick={handleOpenModalForNew} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700">
                    Add Task
                </button>
            </div>
            
            {error && <div className="mb-4"><ErrorAlert message={error} /></div>}
            
            {sortedTasks.length > 0 ? (
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {sortedTasks.map(task => {
                            const isPastDue = task.due_date && new Date(task.due_date) < new Date() && task.status === 'pending';
                            const isCompleted = task.status === 'completed';
                            return (
                             <li key={task.id} className={`p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors duration-500 ease-in-out ${toggledTaskId === task.id ? (isCompleted ? 'bg-green-50 dark:bg-green-900/20' : 'bg-slate-50 dark:bg-slate-700/30') : ''}`}>
                                <div className="flex items-center gap-3 flex-1">
                                    <button onClick={() => handleToggleStatus(task)} className="flex-shrink-0 w-6 h-6 relative" aria-label={task.status === 'pending' ? 'Mark as complete' : 'Mark as pending'}>
                                        {/* Pending state circle */}
                                        <div className={`absolute inset-0 transition-opacity duration-300 ${isCompleted ? 'opacity-0' : 'opacity-100'}`}>
                                            <div className="w-6 h-6 border-2 border-slate-400 dark:border-slate-500 rounded-full"></div>
                                        </div>
                                        {/* Completed state checkmark */}
                                        <div className={`absolute inset-0 transition-opacity duration-300 ${isCompleted ? 'opacity-100' : 'opacity-0'}`}>
                                            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        </div>
                                    </button>
                                    <div className="flex-1">
                                        <p className={`font-medium text-slate-800 dark:text-slate-100 transition-all duration-300 ${isCompleted && 'line-through text-slate-500 dark:text-slate-400'}`}>{task.title}</p>
                                        {task.due_date && (
                                             <p className={`text-sm ${isPastDue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                                                Due: {new Date(task.due_date).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-4 self-end sm:self-center">
                                    <button onClick={() => handleOpenModalForEdit(task)} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Edit</button>
                                    <button onClick={() => handleDelete(task)} className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                                </div>
                            </li>
                        )})}
                    </ul>
                </div>
            ) : (
                <div className="text-center py-16 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <TasksIcon className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                    <h3 className="font-semibold text-lg text-slate-600 dark:text-slate-300">No Tasks for this Matter</h3>
                    <p className="text-sm">Click "Add Task" to create one.</p>
                </div>
            )}
             <TaskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveTask} 
                taskToEdit={taskToEdit} 
                matters={[matter]} 
                matterId={matter.id} 
            />
        </div>
    );
};

export default CaseTasksTab;
