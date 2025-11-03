import React, { useState, useMemo } from 'react';
import { Task, Department, Artisan, TaskStatus } from '../types';
import TaskCard from './TaskCard';
import GanttView from './GanttView';
import { TableCellsIcon, GanttChartIcon } from '../constants';

const KanbanBoard: React.FC<{
    tasks: Task[];
    parentIds: Set<string | undefined>;
    getArtisanName: (id: string) => string;
    getDepartment: (id: string) => Department | undefined;
    onTaskClick: (task: Task) => void;
}> = ({ tasks, parentIds, getArtisanName, getDepartment, onTaskClick }) => {
    const statusColumns = Object.values(TaskStatus);

    return (
        <div className="flex overflow-x-auto space-x-4 pb-4">
            {statusColumns.map(status => {
                const tasksInStatus = tasks.filter(t => t.status === status);
                return (
                    <div key={status} className="flex-shrink-0 w-80 bg-gray-200/50 dark:bg-gray-800/50 rounded-lg">
                        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
                            <h2 className="font-semibold text-gray-700 dark:text-gray-200">{status} <span className="text-sm text-gray-500">{tasksInStatus.length}</span></h2>
                        </div>
                        <div className="p-2 space-y-2 h-full overflow-y-auto">
                            {tasksInStatus.map(task => (
                                <TaskCard 
                                    key={task.id}
                                    task={task}
                                    isParent={parentIds.has(task.id)}
                                    getArtisanName={getArtisanName}
                                    getDepartment={getDepartment}
                                    onCardClick={() => onTaskClick(task)}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ViewSwitcher: React.FC<{ view: 'kanban' | 'gantt'; setView: (view: 'kanban' | 'gantt') => void; }> = ({ view, setView }) => {
    const baseClasses = "flex items-center p-2 rounded-md transition-colors";
    const activeClasses = "bg-primary-600 text-white";
    const inactiveClasses = "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600";
    
    return (
        <div className="flex p-1 space-x-1 bg-gray-200 dark:bg-gray-900/50 rounded-lg">
            <button onClick={() => setView('kanban')} className={`${baseClasses} ${view === 'kanban' ? activeClasses : inactiveClasses}`}>
                <TableCellsIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setView('gantt')} className={`${baseClasses} ${view === 'gantt' ? activeClasses : inactiveClasses}`}>
                <GanttChartIcon className="w-5 h-5" />
            </button>
        </div>
    );
};


const TasksView: React.FC<{
    tasks: Task[];
    departments: Department[];
    artisans: Artisan[];
    onTaskClick: (task: Task) => void;
}> = ({ tasks, departments, artisans, onTaskClick }) => {
    const [departmentFilter, setDepartmentFilter] = useState<string>('all');
    const [artisanFilter, setArtisanFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'kanban' | 'gantt'>('kanban');
    
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const depMatch = departmentFilter === 'all' || task.departmentIds.includes(departmentFilter);
            const artMatch = artisanFilter === 'all' || task.assignedArtisanIds.includes(artisanFilter);
            return depMatch && artMatch;
        });
    }, [tasks, departmentFilter, artisanFilter]);

    const parentIds = useMemo(() => new Set(tasks.map(t => t.parentId).filter(Boolean)), [tasks]);

    const filterInputClasses = "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-1.5 text-sm";
    
    const getArtisanName = (id: string) => artisans.find(a => a.id === id)?.name || 'Unknown';
    const getDepartment = (id: string) => departments.find(d => d.id === id);

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                     <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Task Management</h1>
                     <p className="text-gray-500 dark:text-gray-400">Organize and assign tasks to your artisans</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} className={filterInputClasses}>
                        <option value="all">All Departments</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <select value={artisanFilter} onChange={e => setArtisanFilter(e.target.value)} className={filterInputClasses}>
                        <option value="all">All Artisans</option>
                        {artisans.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <ViewSwitcher view={viewMode} setView={setViewMode} />
                </div>
            </div>
            
            {viewMode === 'kanban' ? (
                <KanbanBoard 
                    tasks={filteredTasks}
                    parentIds={parentIds}
                    getArtisanName={getArtisanName}
                    getDepartment={getDepartment}
                    onTaskClick={onTaskClick}
                />
            ) : (
                <GanttView 
                    tasks={filteredTasks}
                    artisans={artisans}
                    departments={departments}
                    onTaskClick={onTaskClick}
                />
            )}
        </div>
    );
};

export default TasksView;