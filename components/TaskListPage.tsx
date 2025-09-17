
import React, { useState, useMemo } from 'react';
import { Task, Matter } from '../types';
import ErrorAlert from './ErrorAlert';
import TaskModal from './TaskModal';
import SearchIcon from './icons/SearchIcon';
import TasksIcon from './icons/TasksIcon';

interface TaskListPageProps {
  tasks: Task[];
  matters: Matter[];
  onAddTask: (taskData: Omit<Task, 'id' | 'created_at' | 'user_id'>) => Promise<Task>;
  onUpdateTask: (taskData: Omit<Task, 'created_at' | 'user_id'>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

const TaskListPage: React.FC<TaskListPageProps> = ({ tasks, matters, onAddTask, onUpdateTask, onDeleteTask }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [matterFilter, setMatterFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [toggledTaskId, setToggledTaskId] = useState<string | null>(null); // For animation

    const matterMap = useMemo(() => new Map(matters.map(m => [m.id, m.matter_name])), [matters]);

    const filteredTasks = useMemo(() => {
        return tasks
            .filter(task => statusFilter === 'all' || task.status === statusFilter)
            .filter(task => matterFilter === 'all' || task.matter_id === matterFilter)
            .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [tasks, searchTerm, matterFilter, statusFilter]);

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
        } catch(e) {
            // Re-throw to be caught by the modal
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
    }

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Tasks</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your to-do items across all matters.</p>
            </div>
            <button onClick={handleOpenModalForNew} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 self-start sm:self-center">
                Add New Task
            </button>
        </div>

        {error && <div className="my-4"><ErrorAlert message={error} /></div>}

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md" aria-label="Search tasks" />
                </div>
                <div>
                     <select value={matterFilter} onChange={e => setMatterFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent" aria-label="Filter by matter">
                        <option value="all">All Matters</option>
                        {matters.map(m => <option key={m.id} value={m.id}>{m.matter_name}</option>)}
                    </select>
                </div>
                 <div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent" aria-label="Filter by status">
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredTasks.length > 0 ? filteredTasks.map(task => {
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
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {matterMap.get(task.matter_id)}
                                        {task.due_date && <span className="mx-2">&bull;</span>}
                                        {task.due_date && <span className={isPastDue ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                                    </p>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-4 self-end sm:self-center">
                                <button onClick={() => handleOpenModalForEdit(task)} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Edit</button>
                                <button onClick={() => handleDelete(task)} className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                            </div>
                        </li>
                    );
                }) : (
                    <li className="text-center py-16 text-slate-500 dark:text-slate-400">
                        <TasksIcon className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                        <p className="font-semibold">No tasks found.</p>
                        <p className="text-sm">Try adjusting your filters or creating a new task.</p>
                    </li>
                )}
            </ul>
        </div>
        
        <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTask} taskToEdit={taskToEdit} matters={matters} />
    </div>
  );
};
export default TaskListPage;
