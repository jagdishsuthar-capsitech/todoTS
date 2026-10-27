import { createSlice, type PayloadAction, } from '@reduxjs/toolkit';
import type { Task, TaskFormData, TaskState } from '../../types/task';

const initialState: TaskState = {
    tasks: [],
    theme: 'light',
    filter: 'all',
    sortOrder: 'newest',
    searchQuery: '',
    isSidebarOpen: false,
    isModalOpen: false,
    toast: null,
    editingId: null,
    formData: {
        title: '',
        description: '',
        priority: 'medium',
        category: 'Work',
        dueDate: ''
    }
};

export const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        setFilter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },
        setSortOrder: (state, action: PayloadAction<'newest' | 'oldest' | 'asc' | 'desc'>) => {
            state.sortOrder = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setIsSidebarOpen: (state, action: PayloadAction<boolean | undefined>) => {
            state.isSidebarOpen = action.payload !== undefined ? action.payload : !state.isSidebarOpen;
        },
        setIsModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isModalOpen = action.payload;
        },
        setToast: (state, action: PayloadAction<string | null>) => {
            state.toast = action.payload;
        },
        clearToast: (state) => {
            state.toast = null;
        },
        setFormData: (state, action: PayloadAction<Partial<TaskFormData>>) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        openCreateModal: (state) => {
            state.editingId = null;
            state.formData = {
                title: '',
                description: '',
                priority: 'medium',
                category: 'Work',
                dueDate: ''
            };
            state.isModalOpen = true;
        },
        handleEditClick: (state, action: PayloadAction<Task>) => {
            const task = action.payload;
            if (task.completed) return;
            state.editingId = task.id;
            state.formData = {
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'medium',
                category: task.category || 'Work',
                dueDate: task.dueDate || ''
            };
            state.isModalOpen = true;
        },
        handleSubmitTask: (state) => {
            if (!state.formData.title.trim()) return;

            const now = Date.now();
            if (state.editingId !== null) {
                state.tasks = state.tasks.map(t => t.id === state.editingId ? {
                    ...t,
                    ...state.formData,
                    title: state.formData.title.trim(),
                    description: state.formData.description.trim(),
                    updatedAt: now
                } : t);
                state.toast = 'Task updated successfully!';
            } else {
                const newTask: Task = {
                    id: now.toString(),
                    ...state.formData,
                    title: state.formData.title.trim(),
                    description: state.formData.description.trim(),
                    completed: false,
                    dueDate: state.formData.dueDate || new Date().toISOString().split('T')[0],
                    createdAt: now,
                    updatedAt: null
                };
                state.tasks = [newTask, ...state.tasks];
                state.toast = 'Task created successfully!';
            }
            state.isModalOpen = false;
        },
        toggleComplete: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.tasks = state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
            state.toast = 'Task status updated';
        },
        handleDelete: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.tasks = state.tasks.filter(t => t.id !== id);
            state.toast = 'Task deleted';
        },
        handleClearCompleted: (state) => {
            state.tasks = state.tasks.filter(t => !t.completed);
            state.toast = 'Cleared completed tasks';
        }
    }
});

export const {
    setTheme, toggleTheme, setFilter, setSortOrder, setSearchQuery, setIsSidebarOpen, setIsModalOpen, setToast, clearToast, setFormData,
    openCreateModal, handleEditClick, handleSubmitTask, toggleComplete, handleDelete, handleClearCompleted
} = taskSlice.actions;

export const selectTheme = (state: { tasks: TaskState }) => state.tasks;

export default taskSlice.reducer;