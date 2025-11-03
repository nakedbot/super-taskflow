import React, { useMemo } from 'react';
import { Task, Artisan, Department } from '../types';

const DAY_WIDTH = 40; // width of a single day column in pixels
const ROW_HEIGHT = 48; // height of a single task row in pixels
const HEADER_HEIGHT = 60; // height of the date header

const differenceInDays = (dateLeft: Date, dateRight: Date): number => {
    const diff = new Date(dateLeft).setHours(0, 0, 0, 0) - new Date(dateRight).setHours(0, 0, 0, 0);
    return Math.round(diff / (1000 * 60 * 60 * 24));
};

const addDays = (date: Date, days: number): Date => {
    const newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

const GanttView: React.FC<{
    tasks: Task[];
    artisans: Artisan[];
    departments: Department[];
    onTaskClick: (task: Task) => void;
}> = ({ tasks, artisans, departments, onTaskClick }) => {

    const { dateRange, chartStartDate, totalDays } = useMemo(() => {
        if (tasks.length === 0) {
            const today = new Date();
            const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            const endDate = addDays(startDate, 30);
            return { dateRange: [], chartStartDate: startDate, totalDays: 31 };
        }
        
        let minDate = new Date(tasks[0].createdDate);
        let maxDate = new Date(tasks[0].dueDate);

        for (const task of tasks) {
            if (task.createdDate < minDate) minDate = task.createdDate;
            if (task.dueDate > maxDate) maxDate = task.dueDate;
        }

        const chartStartDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
        const chartEndDate = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);
        
        const dateArr: Date[] = [];
        let currentDate = new Date(chartStartDate);
        while (currentDate <= chartEndDate) {
            dateArr.push(new Date(currentDate));
            currentDate = addDays(currentDate, 1);
        }
        
        return { dateRange: dateArr, chartStartDate, totalDays: dateArr.length };
    }, [tasks]);

    const getDepartmentColor = (task: Task) => {
        if (task.departmentIds.length > 0) {
            const department = departments.find(d => d.id === task.departmentIds[0]);
            // Tailwind doesn't support dynamic class names, so we return the color name for inline styling
            const colorMap: { [key: string]: string } = {
                'bg-department-carpentry': '#a3e635',
                'bg-department-upholstery': '#67e8f9',
                'bg-department-cabinetry': '#d8b4fe',
                'bg-department-spraying': '#fde047',
            };
            return department ? colorMap[department.color] || '#a3a3a3' : '#a3a3a3';
        }
        return '#a3a3a3'; // neutral-400
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <div style={{ minWidth: `${250 + totalDays * DAY_WIDTH}px` }}>
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 flex" style={{ height: `${HEADER_HEIGHT}px` }}>
                        <div className="w-[250px] flex-shrink-0 border-r dark:border-gray-600 flex items-center p-4">
                            <h4 className="font-semibold">Task</h4>
                        </div>
                        <div className="flex-grow grid" style={{ gridTemplateColumns: `repeat(${totalDays}, ${DAY_WIDTH}px)` }}>
                            {dateRange.map((date, i) => (
                                <div key={i} className="border-r dark:border-gray-600 text-center py-2">
                                    <div className="text-xs text-gray-500">{date.toLocaleDateString('en-us', { month: 'short' })}</div>
                                    <div className="font-semibold text-lg">{date.getDate()}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="relative" style={{ height: `${tasks.length * ROW_HEIGHT}px` }}>
                        {/* Task List on Left */}
                        <div className="absolute top-0 left-0 w-[250px] z-20">
                            {tasks.map((task, i) => (
                                <div key={task.id} className="h-12 border-r border-b dark:border-gray-600 flex items-center px-4 truncate bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer" onClick={() => onTaskClick(task)}>
                                    <span className="truncate">{task.title}</span>
                                </div>
                            ))}
                        </div>

                        {/* Timeline Grid & Bars */}
                        <div className="absolute top-0 left-[250px] right-0 h-full">
                             {/* Vertical Grid Lines */}
                            <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${totalDays}, ${DAY_WIDTH}px)` }}>
                                {Array.from({ length: totalDays }).map((_, i) => (
                                    <div key={i} className="border-r dark:border-gray-600 h-full"></div>
                                ))}
                            </div>
                            {/* Horizontal Grid Lines */}
                             <div className="absolute inset-0">
                                {Array.from({ length: tasks.length }).map((_, i) => (
                                    <div key={i} className="border-b dark:border-gray-600 h-12"></div>
                                ))}
                            </div>
                            
                            {/* Task Bars */}
                            {tasks.map((task, i) => {
                                const startOffsetDays = differenceInDays(task.createdDate, chartStartDate);
                                const durationDays = differenceInDays(task.dueDate, task.createdDate) + 1;
                                
                                const left = startOffsetDays * DAY_WIDTH;
                                const width = durationDays * DAY_WIDTH - 4; // -4 for padding

                                return (
                                    <div 
                                        key={task.id} 
                                        className="absolute h-8 rounded-md flex items-center px-2 cursor-pointer transition-all hover:opacity-80"
                                        style={{
                                            top: `${i * ROW_HEIGHT + 8}px`,
                                            left: `${left}px`,
                                            width: `${width}px`,
                                            backgroundColor: getDepartmentColor(task),
                                        }}
                                        onClick={() => onTaskClick(task)}
                                    >
                                        <span className="text-sm font-semibold text-gray-800 truncate">{task.title}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttView;
