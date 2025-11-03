import React, { useState, useCallback, useEffect } from 'react';
import { Task, Department, Artisan, Supervisor, View, Notification, TaskStatus, ArtisanRole, TaskPriority } from './types';
import { INITIAL_TASKS, DEPARTMENTS, ARTISANS, SUPERVISORS } from './constants';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TasksView from './components/TaskBoard'; // Renamed TaskBoard to TasksView for clarity
import TaskFormModal from './components/TaskFormModal';
import NotificationToast from './components/NotificationToast';

const ArtisanFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (artisan: Omit<Artisan, 'id'>) => void;
    departments: Department[];
}> = ({ isOpen, onClose, onSave, departments }) => {
    const [name, setName] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [role, setRole] = useState<ArtisanRole>(ArtisanRole.Trainee);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setDepartmentId('');
            setRole(ArtisanRole.Trainee);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !departmentId || !role) return;
        onSave({ name, departmentId, role });
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-[100] ${isOpen ? 'visible' : 'invisible'} flex justify-end`} onAnimationEnd={() => !isOpen && {}}>
            <div className={`fixed inset-0 bg-black bg-opacity-50 ${isOpen ? 'animate-fade-in' : 'animate-fade-out'}`} onClick={onClose}></div>
            <div className={`relative w-full max-w-md bg-white dark:bg-gray-800 shadow-xl h-full ${isOpen ? 'animate-slide-in-right' : 'animate-slide-out-right'}`}>
                <div className="p-6 h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex-shrink-0">Add New Artisan</h2>
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                        <div className="flex-1 overflow-y-auto -mr-6 pr-6 space-y-4">
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="Artisan Name" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                            <select value={departmentId} onChange={e => setDepartmentId(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                                <option value="">Select Department</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                            <select value={role} onChange={e => setRole(e.target.value as ArtisanRole)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                                {Object.values(ArtisanRole).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="mt-auto pt-6 flex justify-end space-x-2 border-t dark:border-gray-700 -mx-6 px-6">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded text-gray-800 dark:bg-gray-600 dark:text-gray-200">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [departments] = useState<Department[]>(DEPARTMENTS);
    const [artisans, setArtisans] = useState<Artisan[]>(ARTISANS);
    const [supervisors] = useState<Supervisor[]>(SUPERVISORS);
    const [currentSupervisor] = useState<Supervisor>(SUPERVISORS[0]); // Assume admin is logged in
    const [activeView, setActiveView] = useState<View>('tasks');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isArtisanModalOpen, setIsArtisanModalOpen] = useState(false);
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
        const newNotification = { id: Date.now(), message, type };
        setNotifications(prev => [...prev, newNotification]);
    }, []);

    const removeNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const handleUpdateTask = useCallback((taskId: string, updates: Partial<Omit<Task, 'id' | 'history'>>, note: string) => {
         setTasks(prevTasks => prevTasks.map(t =>
            t.id === taskId
                ? {
                    ...t,
                    ...updates,
                    lastEditedById: currentSupervisor.id,
                    history: note ? [...t.history, { note, editorId: currentSupervisor.id, timestamp: new Date() }] : t.history
                }
                : t
        ));
    }, [currentSupervisor.id]);

    const handleSaveTask = (taskData: Omit<Task, 'id' | 'history'>, isEditing: boolean) => {
        if (isEditing && taskToEdit) {
            handleUpdateTask(taskToEdit.id, taskData, 'Task details updated.');
            addNotification(`Task "${taskData.title}" updated successfully.`, 'success');
        } else {
            const newTask: Task = {
                ...taskData,
                id: `task-${Date.now()}`,
                history: [{ note: 'Task created.', editorId: currentSupervisor.id, timestamp: new Date() }]
            };
            setTasks(prevTasks => [...prevTasks, newTask]);
            addNotification(`New task "${newTask.title}" created.`, 'success');
        }
        setIsTaskModalOpen(false);
        setTaskToEdit(null);
    };

    const handleSaveArtisan = (artisanData: Omit<Artisan, 'id'>) => {
        const newArtisan: Artisan = {
            ...artisanData,
            id: `art-${Date.now()}`
        };
        setArtisans(prev => [...prev, newArtisan]);
        addNotification(`Artisan "${newArtisan.name}" added.`, 'success');
        setIsArtisanModalOpen(false);
    };

    const handleOpenCreateModal = () => {
        setTaskToEdit(null);
        setIsTaskModalOpen(true);
    };
    
    const handleOpenEditModal = (task: Task) => {
        if (!currentSupervisor.permissions.edit) {
            addNotification('You do not have permission to edit tasks.', 'error');
            return;
        }
        setTaskToEdit(task);
        setIsTaskModalOpen(true);
    };

    const handleDeleteTask = (taskId: string) => {
        if (!currentSupervisor.permissions.delete) {
            addNotification('You do not have permission to delete tasks.', 'error');
            return;
        }
        const taskToDelete = tasks.find(t => t.id === taskId);
        if (taskToDelete && window.confirm(`Are you sure you want to delete "${taskToDelete.title}"?`)) {
            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
            addNotification(`Task "${taskToDelete.title}" deleted.`, 'info');
        }
    };
    
    return (
        <div className="min-h-screen text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
            <Header
                activeView={activeView}
                setActiveView={setActiveView}
                onNewTaskClick={handleOpenCreateModal}
                isSideMenuOpen={isSideMenuOpen}
                setIsSideMenuOpen={setIsSideMenuOpen}
                onNewArtisanClick={() => setIsArtisanModalOpen(true)}
             />
            <main className="p-4 sm:p-6 lg:p-8">
                {activeView === 'dashboard' && (
                    <Dashboard tasks={tasks} departments={departments} artisans={artisans} />
                )}
                {activeView === 'tasks' && (
                   <TasksView
                        tasks={tasks}
                        departments={departments}
                        artisans={artisans}
                        onTaskClick={handleOpenEditModal}
                    />
                )}
            </main>
            
            <TaskFormModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSave={handleSaveTask}
                onUpdateTask={handleUpdateTask}
                taskToEdit={taskToEdit}
                tasks={tasks}
                departments={departments}
                artisans={artisans}
                supervisors={supervisors}
                currentSupervisorId={currentSupervisor.id}
            />

            <ArtisanFormModal
                isOpen={isArtisanModalOpen}
                onClose={() => setIsArtisanModalOpen(false)}
                onSave={handleSaveArtisan}
                departments={departments}
            />

             <div className="fixed bottom-4 right-4 z-[110] flex flex-col space-y-2">
                {notifications.map(n => (
                    <NotificationToast
                        key={n.id}
                        notification={n}
                        onDismiss={() => removeNotification(n.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;