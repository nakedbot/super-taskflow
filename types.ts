export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  InReview = 'In Review',
  Completed = 'Completed',
  Backlog = 'Backlog',
}

export enum TaskPriority {
  Medium = 'Medium',
  Critical = 'Critical',
}

export enum ArtisanRole {
  Artisan = 'Artisan',
  Lead = 'Lead',
  Trainee = 'Trainee',
}

export enum SupervisorRole {
  Supervisor = 'Supervisor',
  Admin = 'Admin',
}

export interface Permission {
  addNotes: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Supervisor {
  id: string;
  name: string;
  role: SupervisorRole;
  permissions: Permission;
}

export interface Artisan {
  id: string;
  name: string;
  departmentId: string;
  role: ArtisanRole;
}

export interface Department {
  id: string;
  name: string;
  isOutsourced: boolean;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  jobId: string;
  client: string;
  description: string;
  createdDate: Date;
  dueDate: Date;
  completedDate: Date | null;
  status: TaskStatus;
  priority: TaskPriority | null;
  departmentIds: string[];
  assignedArtisanIds: string[];
  timeSpentMs: number | null;
  qualityRating: number | null;
  supervisorNotes: string;
  lastEditedById: string | null;
  history: { note: string; editorId: string; timestamp: Date }[];
  parentId?: string;
  images?: string[];
}

export type View = 'dashboard' | 'tasks';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}