import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskState } from '../../types/task';

const initialState: TaskState = {
    tasks: [],
    theme: 'light',
    filter: 'all',
    sortOrder: 'newest',
    searchQuery: '',
    isSidebarOpen: false,
    toast: null,
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
        setToast: (state, action: PayloadAction<string | null>) => {
            state.toast = action.payload;
        },
        clearToast: (state) => {
            state.toast = null;
        },
        addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>>) => {
            const now = Date.now();
            const newTask: Task = {
                id: now.toString(),
                ...action.payload,
                completed: false,
                dueDate: action.payload.dueDate || new Date().toISOString().split('T')[0],
                createdAt: now,
                updatedAt: null,
            };
            state.tasks = [newTask, ...state.tasks];
            state.toast = 'Task created successfully!';
        },
        updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
            const { id, updates } = action.payload;
            const now = Date.now();
            state.tasks = state.tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: now } : t);
            state.toast = 'Task updated successfully!';
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
    setTheme, toggleTheme, setFilter, setSortOrder, setSearchQuery, 
    setIsSidebarOpen, setToast, clearToast, addTask, updateTask, 
    toggleComplete, handleDelete, handleClearCompleted
} = taskSlice.actions;

export const selectTheme = (state: { tasks: TaskState }) => state.tasks;

export default taskSlice.reducer;