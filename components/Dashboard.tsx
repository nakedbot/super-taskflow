import React, { useMemo, useState } from 'react';
import { Task, Department, Artisan, TaskStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KPICard: React.FC<{ label: string; value: string | number; subValue?: string, progress?: number }> = ({ label, value, subValue, progress }) => {
    const radius = 25;
    const circumference = 2 * Math.PI * radius;
    const offset = progress !== undefined ? circumference - (progress / 100) * circumference : 0;
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center space-x-4">
            {progress !== undefined && (
                 <div className="relative w-16 h-16">
                    <svg className="w-full h-full" viewBox="0 0 60 60">
                        <circle className="text-gray-200 dark:text-gray-700" strokeWidth="6" stroke="currentColor" fill="transparent" r={radius} cx="30" cy="30"/>
                        <circle
                            className="text-primary-600"
                            strokeWidth="6"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="30"
                            cy="30"
                            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-gray-200">{`${Math.round(progress)}%`}</div>
                </div>
            )}
            <div>
                 <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value} <span className="text-lg font-normal text-gray-500">{subValue}</span></div>
                 <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{label}</div>
            </div>
        </div>
    );
};

const Dashboard: React.FC<{ tasks: Task[], departments: Department[], artisans: Artisan[] }> = ({ tasks, departments, artisans }) => {
    const [departmentFilter, setDepartmentFilter] = useState<string>('all');

    const filteredTasks = useMemo(() => {
        if (departmentFilter === 'all') return tasks;
        return tasks.filter(t => t.departmentIds.includes(departmentFilter));
    }, [tasks, departmentFilter]);
    
    const completedTasks = useMemo(() => filteredTasks.filter(t => t.status === TaskStatus.Completed), [filteredTasks]);

    const totalTasks = filteredTasks.length;
    const totalCompleted = completedTasks.length;
    const completionProgress = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;
    
    const avgQuality = useMemo(() => {
        const ratedTasks = completedTasks.filter(t => t.qualityRating !== null && t.qualityRating > 0);
        if (ratedTasks.length === 0) return 0;
        const totalRating = ratedTasks.reduce((sum, t) => sum + t.qualityRating!, 0);
        return (totalRating / ratedTasks.length);
    }, [completedTasks]);
    
    const avgCompletionTime = useMemo(() => {
        const timedTasks = completedTasks.filter(t => t.timeSpentMs !== null);
        if (timedTasks.length === 0) return 'N/A';
        const totalMs = timedTasks.reduce((sum, t) => sum + t.timeSpentMs!, 0);
        const avgMs = totalMs / timedTasks.length;
        const avgDays = avgMs / (1000 * 60 * 60 * 24);
        return `${avgDays.toFixed(1)} days`;
    }, [completedTasks]);

    const departmentPerformance = useMemo(() => {
        return departments.map(dep => {
            const depTasks = tasks.filter(t => t.departmentIds.includes(dep.id));
            const quantity = depTasks.length;
            const completed = depTasks.filter(t => t.status === TaskStatus.Completed).length;
            return { name: dep.name, Total: quantity, Completed: completed };
        });
    }, [tasks, departments]);

    const artisanLeaderboard = useMemo(() => {
        const artisanStats: { [key: string]: { name: string, completed: number } } = {};
        artisans.forEach(art => {
            if (departmentFilter === 'all' || art.departmentId === departmentFilter) {
                artisanStats[art.id] = { name: art.name, completed: 0 };
            }
        });
        completedTasks.forEach(task => {
            task.assignedArtisanIds.forEach(artisanId => {
                if (artisanStats[artisanId]) {
                    artisanStats[artisanId].completed++;
                }
            });
        });
        return Object.values(artisanStats).sort((a, b) => b.completed - a.completed).slice(0, 5);
    }, [completedTasks, artisans, departmentFilter]);
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
                 <select onChange={(e) => setDepartmentFilter(e.target.value)} value={departmentFilter} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2">
                    <option value="all">All Departments</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <KPICard label="Total Tasks" value={totalTasks} />
                 <KPICard label="Completed Tasks" value={totalCompleted} progress={completionProgress} />
                 <KPICard label="Avg. Quality Rating" value={avgQuality.toFixed(1)} subValue="/ 5" />
                 <KPICard label="Avg. Completion Time" value={avgCompletionTime} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Department Workload</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentPerformance} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.3)" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31,41,55,0.8)', border: 'none', color: '#fff' }}/>
                            <Legend />
                            <Bar dataKey="Total" stackId="a" fill="#a3a3a3" name="Pending/In Progress" />
                            <Bar dataKey="Completed" stackId="a" fill="#3b82f6" name="Completed" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Artisan Leaderboard</h3>
                    <ul className="space-y-3">
                        {artisanLeaderboard.filter(a => a.completed > 0).map((artisan, index) => (
                            <li key={artisan.name} className="flex justify-between items-center p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                                <span className="font-medium text-gray-700 dark:text-gray-200">{index + 1}. {artisan.name}</span>
                                <span className="font-bold text-primary-600 dark:text-primary-400">{artisan.completed} tasks</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;