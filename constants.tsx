import { Department, Artisan, Supervisor, Task, TaskStatus, ArtisanRole, SupervisorRole, TaskPriority } from './types';

export const DEPARTMENTS: Department[] = [
  { id: 'dep1', name: 'Carpentry', isOutsourced: false, color: 'bg-department-carpentry' },
  { id: 'dep2', name: 'Upholstery', isOutsourced: false, color: 'bg-department-upholstery' },
  { id: 'dep3', name: 'Cabinetry', isOutsourced: false, color: 'bg-department-cabinetry' },
  { id: 'dep4', name: 'Spraying', isOutsourced: true, color: 'bg-department-spraying' },
];

export const ARTISANS: Artisan[] = [
  { id: 'art1', name: 'ThankGod Emmanuel', departmentId: 'dep1', role: ArtisanRole.Lead },
  { id: 'art2', name: 'Toyin Sakiryrhau', departmentId: 'dep2', role: ArtisanRole.Artisan },
  { id: 'art3', name: 'Abdullahi Issa', departmentId: 'dep1', role: ArtisanRole.Artisan },
  { id: 'art4', name: 'Mary Williams', departmentId: 'dep3', role: ArtisanRole.Lead },
  { id: 'art5', name: 'David Brown', departmentId: 'dep4', role: ArtisanRole.Trainee },
  { id: 'art6', name: 'Susan Garcia', departmentId: 'dep2', role: ArtisanRole.Trainee },
];

export const SUPERVISORS: Supervisor[] = [
  { id: 'sup1', name: 'Admin User', role: SupervisorRole.Admin, permissions: { addNotes: true, edit: true, delete: true } },
  { id: 'sup2', name: 'Supervisor Sam', role: SupervisorRole.Supervisor, permissions: { addNotes: true, edit: true, delete: false } },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task1',
    title: '15 Ottoman',
    jobId: 'JOB-2025-2059',
    client: 'Justrite stores',
    description: 'To cover 15 Ottoman',
    createdDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    completedDate: null,
    status: TaskStatus.InProgress,
    priority: TaskPriority.Medium,
    departmentIds: ['dep2'],
    assignedArtisanIds: ['art1'],
    timeSpentMs: null,
    qualityRating: null,
    supervisorNotes: 'Additional 4 ROUND ottomans is added today.',
    lastEditedById: 'sup1',
    history: [],
    images: [
        'https://i.imgur.com/vB5Qdw7.png',
        'https://i.imgur.com/bZ2JzGW.png',
    ]
  },
  {
    id: 'task2',
    title: 'Recover Sorrel & Iffi',
    jobId: 'JOB-2025-8918',
    client: 'Westbrook Mall',
    description: 'We are recovering these chairs: 2 SORREL 1 IFFI',
    createdDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    completedDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    status: TaskStatus.Completed,
    priority: TaskPriority.Medium,
    departmentIds: ['dep2'],
    assignedArtisanIds: ['art2'],
    timeSpentMs: 4 * 24 * 60 * 60 * 1000,
    qualityRating: 4,
    supervisorNotes: '',
    lastEditedById: 'sup1',
    history: [],
    parentId: 'task4',
    images: [
        'https://i.imgur.com/kSj9s9r.png',
        'https://i.imgur.com/VvBvF61.png',
    ]
  },
  {
    id: 'task3',
    title: '24 Gold Frame Chairs',
    jobId: 'JOB-2025-2934',
    client: 'Soulmate Hotel',
    description: 'To make back and seat for the 24 frames',
    createdDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    dueDate: new Date(),
    completedDate: null,
    status: TaskStatus.Completed,
    priority: TaskPriority.Critical,
    departmentIds: ['dep1'],
    assignedArtisanIds: ['art3'],
    timeSpentMs: null,
    qualityRating: 3,
    supervisorNotes: 'He completed 9 BACK & SEAT yesterday. Completed 9 on FRIDAY. Remaining 15',
    lastEditedById: 'sup2',
    history: [],
    parentId: 'task4',
    images: [
        'https://i.imgur.com/wO832p3.png',
        'https://i.imgur.com/Q2xvyxY.png',
    ]
  },
  {
    id: 'task4',
    title: 'Hotel Furniture Contract',
    jobId: 'JOB-2025-2900',
    client: 'Major Hotel Group',
    description: 'Parent job for all hotel-related tasks.',
    createdDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 20)),
    completedDate: null,
    status: TaskStatus.InProgress,
    priority: null,
    departmentIds: ['dep1', 'dep2'],
    assignedArtisanIds: [],
    timeSpentMs: null,
    qualityRating: null,
    supervisorNotes: 'Overseeing all sub-tasks for this contract.',
    lastEditedById: 'sup1',
    history: [],
  },
   {
    id: 'task5',
    title: 'Spray Paint Table Legs',
    jobId: 'JOB-2025-3100',
    client: 'Justrite stores',
    description: 'Apply lacquer to 15 sets of ottoman legs.',
    createdDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    completedDate: null,
    status: TaskStatus.Pending,
    priority: null,
    departmentIds: ['dep4'],
    assignedArtisanIds: ['art5'],
    timeSpentMs: null,
    qualityRating: null,
    supervisorNotes: '',
    lastEditedById: 'sup1',
    history: [],
    parentId: 'task1'
  },
];

// Icons
export const ChartBarIcon = (props: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

export const TableCellsIcon = (props: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);

export const GanttChartIcon = (props: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M3 9.5h14M3 14.5h18M3 19.5h8" />
  </svg>
);

export const PlusIcon = (props: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const CheckCircleIcon = (props: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const XCircleIcon = (props: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const InformationCircleIcon = (props: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

export const MenuIcon = (props: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

export const XMarkIcon = (props: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export const TrashIcon = (props: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033C6.91 2.75 6 3.704 6 4.866v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export const UserPlusIcon = (props: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3.375 19.5h17.25a2.25 2.25 0 0 0 2.25-2.25v-1.5a2.25 2.25 0 0 0-2.25-2.25H3.375a2.25 2.25 0 0 0-2.25 2.25v1.5a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);