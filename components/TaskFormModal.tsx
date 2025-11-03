import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Task, Department, Artisan, Supervisor, TaskStatus, TaskPriority } from '../types';
import { XMarkIcon } from '../constants';

interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (taskData: Omit<Task, 'id' | 'history'>, isEditing: boolean) => void;
    onUpdateTask: (taskId: string, updates: Partial<Task>, note: string) => void;
    taskToEdit: Task | null;
    tasks: Task[];
    departments: Department[];
    artisans: Artisan[];
    supervisors: Supervisor[];
    currentSupervisorId: string;
}

const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
    const timeoutRef = useRef<number | null>(null);
    return (...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            callback(...args);
        }, delay);
    };
};

const TaskFormModal: React.FC<TaskFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onUpdateTask,
    taskToEdit,
    tasks,
    departments,
    artisans,
    currentSupervisorId,
}) => {
    const [formData, setFormData] = useState<Partial<Task>>({});

    useEffect(() => {
        if (isOpen) {
             if (taskToEdit) {
                setFormData(taskToEdit);
            } else {
                setFormData({
                    title: '',
                    jobId: `JOB-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
                    client: '',
                    description: '',
                    dueDate: new Date(),
                    departmentIds: [],
                    assignedArtisanIds: [],
                    status: TaskStatus.Pending,
                    supervisorNotes: '',
                    priority: null,
                    parentId: '',
                });
            }
        }
    }, [taskToEdit, isOpen]);

    const debouncedNotesUpdate = useDebounce((notes: string) => {
        if (taskToEdit) {
            onUpdateTask(taskToEdit.id, { supervisorNotes: notes }, 'Supervisor notes updated.');
        }
    }, 1000);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        let processedValue: any = value;
        if (name === 'priority' && value === 'None') {
            processedValue = null;
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
        
        if (name === 'supervisorNotes') {
            debouncedNotesUpdate(value);
        }
    };

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name } = e.target;
        const options = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        setFormData(prev => ({ ...prev, [name]: options }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const taskData = {
            title: formData.title || '',
            jobId: formData.jobId || '',
            client: formData.client || '',
            description: formData.description || '',
            createdDate: taskToEdit ? taskToEdit.createdDate : new Date(),
            dueDate: formData.dueDate ? new Date(formData.dueDate) : new Date(),
            completedDate: formData.completedDate || null,
            status: formData.status || TaskStatus.Pending,
            priority: formData.priority || null,
            departmentIds: formData.departmentIds || [],
            assignedArtisanIds: formData.assignedArtisanIds || [],
            timeSpentMs: formData.timeSpentMs || null,
            qualityRating: formData.qualityRating || null,
            supervisorNotes: formData.supervisorNotes || '',
            lastEditedById: currentSupervisorId,
            parentId: formData.parentId || undefined,
        };
        onSave(taskData, !!taskToEdit);
    };

    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";

    return (
        <div className={`fixed inset-0 z-[100] ${isOpen ? 'visible' : 'invisible'} flex justify-end`}>
            <div className={`fixed inset-0 bg-black bg-opacity-50 ${isOpen ? 'animate-fade-in' : 'animate-fade-out'}`} onClick={onClose}></div>
            <div className={`relative w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl h-full ${isOpen ? 'animate-slide-in-right' : 'animate-slide-out-right'}`}>
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                    <div className="p-6 flex items-center justify-between border-b dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-6 flex-grow overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-1"><label className="block text-sm font-medium mb-1">Title</label><input type="text" name="title" value={formData.title || ''} onChange={handleChange} className={inputClasses} required /></div>
                            <div className="md:col-span-1"><label className="block text-sm font-medium mb-1">Job ID</label><input type="text" name="jobId" value={formData.jobId || ''} onChange={handleChange} className={inputClasses} required /></div>
                            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Client</label><input type="text" name="client" value={formData.client || ''} onChange={handleChange} className={inputClasses} required /></div>
                            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea name="description" value={formData.description || ''} onChange={handleChange} className={inputClasses} rows={3}></textarea></div>
                            <div className="md:col-span-1"><label className="block text-sm font-medium mb-1">Due Date</label><input type="date" name="dueDate" value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''} onChange={handleChange} className={inputClasses} required /></div>
                            <div className="md:col-span-1"><label className="block text-sm font-medium mb-1">Status</label><select name="status" value={formData.status} onChange={handleChange} className={inputClasses}>{Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                             <div className="md:col-span-1"><label className="block text-sm font-medium mb-1">Priority</label><select name="priority" value={formData.priority || 'None'} onChange={handleChange} className={inputClasses}><option>None</option>{Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                             <div className="md:col-span-1"><label className="block text-sm font-medium mb-1">Parent Job</label><select name="parentId" value={formData.parentId || ''} onChange={handleChange} className={inputClasses}><option value="">None</option>{tasks.filter(t => t.id !== taskToEdit?.id).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select></div>
                            <div className="md:col-span-1"><label className="block text-sm font-medium mb-1">Departments</label><select multiple name="departmentIds" value={formData.departmentIds} onChange={handleMultiSelectChange} className={inputClasses + " h-32"}>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                            <div className="md:col-span-1"><label className="block text-sm font-medium mb-1">Assigned Artisans</label><select multiple name="assignedArtisanIds" value={formData.assignedArtisanIds} onChange={handleMultiSelectChange} className={inputClasses + " h-32"}>{artisans.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
                            {taskToEdit && (
                               <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Supervisor Notes (autosaves)</label><textarea name="supervisorNotes" value={formData.supervisorNotes || ''} onChange={handleChange} className={inputClasses} rows={4}></textarea></div>
                            )}
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end space-x-2 border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskFormModal;