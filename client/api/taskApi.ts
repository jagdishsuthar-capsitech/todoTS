import axios from 'axios';
import type { Task } from '../src/types/task';

const API = axios.create({
    baseURL: 'http://localhost:5110/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
    const response = await API.get<Task[]>('/tasks');
    return response.data;
};

// Get task by ID
export const getTaskById = async (id: string): Promise<Task> => {
    const response = await API.get<Task>(`/tasks/${id}`);
    return response.data;
};

// Create task
export const createTask = async (
    task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>
): Promise<Task> => {
    const response = await API.post<Task>('/tasks', task);
    return response.data;
};

// Update task
export const updateTask = async (
    id: string,
    task: Partial<Task>
): Promise<Task> => {
    const response = await API.put<Task>(`/tasks/${id}`, task);
    return response.data;
};

// Toggle task completion
export const toggleTaskComplete = async (id: string): Promise<Task> => {
    const response = await API.patch<Task>(`/tasks/${id}/complete`);
    return response.data;
};

// Delete task
export const deleteTask = async (id: string) => {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
};

// Clear completed tasks
export const clearCompletedTasks = async () => {
    const response = await API.delete('/tasks/completed');
    return response.data;
};

export default API;