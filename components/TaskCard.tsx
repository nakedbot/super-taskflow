import React from 'react';
import { Task, TaskPriority, Department } from '../types';

interface TaskCardProps {
    task: Task;
    isParent: boolean;
    getArtisanName: (id: string) => string;
    getDepartment: (id: string) => Department | undefined;
    onCardClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isParent, getArtisanName, getDepartment, onCardClick }) => {
    const artisan = task.assignedArtisanIds.length > 0 ? getArtisanName(task.assignedArtisanIds[0]) : 'Unassigned';
    const department = task.departmentIds.length > 0 ? getDepartment(task.departmentIds[0]) : undefined;
    
    const priorityClasses = {
        [TaskPriority.Critical]: 'bg-priority-critical text-priority-critical-text',
        [TaskPriority.Medium]: 'bg-priority-medium text-priority-medium-text',
    };

    const isOverdue = !task.completedDate && new Date(task.dueDate) < new Date();
    
    const deliveryStatus = () => {
        if (task.completedDate) {
            const diff = new Date(task.completedDate).getTime() - new Date(task.dueDate).getTime();
            const days = Math.ceil(diff / (1000 * 3600 * 24));
            if (days <= 0) return <span className="text-green-600">On time</span>;
            return <span className="text-red-600">Delivered {days}d late</span>;
        }
        if (isOverdue) {
            return <span className="text-red-600">Overdue</span>;
        }
        return <span className="text-gray-500">On track</span>;
    };
    
    const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
        <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-500">{label}:</span>
            <span className="text-sm text-right font-medium text-gray-800 dark:text-gray-200">{children}</span>
        </div>
    );

    return (
        <div onClick={onCardClick} className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white pr-2">{task.title}</h3>
                 <div className="flex-shrink-0 flex items-center gap-2">
                    {task.priority && (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorityClasses[task.priority]}`}>{task.priority}</span>
                    )}
                    {isParent && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-200 text-purple-700">Parent Job</span>
                    )}
                </div>
            </div>

            <div className="space-y-1.5">
                <InfoRow label="Artisan">{artisan} {department && <span className="text-gray-400">({department.name})</span>}</InfoRow>
                <InfoRow label="Job ID">{task.jobId}</InfoRow>
                <InfoRow label="Client">{task.client}</InfoRow>
                <InfoRow label="Status">{task.status}</InfoRow>
                <InfoRow label="Expected Delivery">
                    <div className="flex flex-col items-end">
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        {deliveryStatus()}
                    </div>
                </InfoRow>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 pt-1">{task.description}</p>

            {task.supervisorNotes && (
                 <div className="p-2 bg-yellow-50 dark:bg-yellow-500/10 rounded-md mt-2">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200"><span className="font-semibold">Supervisor Notes:</span> {task.supervisorNotes}</p>
                 </div>
            )}

            {task.images && task.images.length > 0 && (
                <div className="flex space-x-2 pt-2">
                    {task.images.map((img, index) => (
                        <img key={index} src={img} alt={`task image ${index + 1}`} className="w-1/2 h-24 object-cover rounded-md" />
                    ))}
                </div>
            )}

            {task.qualityRating && (
                <div className="flex items-center space-x-1 pt-1">
                    <span className="text-sm text-gray-500">Quality:</span>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                             <svg key={i} className={`w-4 h-4 ${i < task.qualityRating! ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                             </svg>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default TaskCard;