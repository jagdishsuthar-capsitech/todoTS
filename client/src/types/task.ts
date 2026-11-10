export type Priority = 'low' | 'medium' | 'high';
export type Category = 'Work' | 'Personal' | 'Ideas';

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    category: Category;
    dueDate: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface TaskState {
    tasks: Task[];
    theme: 'light' | 'dark';
    filter: string;
    sortOrder: 'newest' | 'oldest' | 'asc' | 'desc';
    searchQuery: string;
    isSidebarOpen: boolean;
    toast: string | null;
    loading: boolean;
    error: string | null;
}