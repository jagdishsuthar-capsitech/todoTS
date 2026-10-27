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
    createdAt: number;
    updatedAt: number | null;
}

export interface TaskFormData {
    title: string;
    description: string;
    priority: Priority;
    category: Category;
    dueDate: string;
}

export interface TaskState {
    tasks: Task[];
    theme: 'light' | 'dark';
    filter: string;
    sortOrder: 'newest' | 'oldest' | 'asc' | 'desc';
    searchQuery: string;
    isSidebarOpen: boolean;
    isModalOpen: boolean;
    toast: string | null;
    editingId: string | null;
    formData: TaskFormData;
}