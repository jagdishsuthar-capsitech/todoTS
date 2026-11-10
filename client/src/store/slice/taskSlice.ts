import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskState } from '../../types/task';
import {
    getTasks,
    createTask as createTaskAPI,
    updateTask as updateTaskAPI,
    toggleTaskComplete as toggleTaskCompleteAPI,
    deleteTask as deleteTaskAPI,
    clearCompletedTasks as clearCompletedTasksAPI,
} from '../../../api/taskApi';

type CreateTaskPayload = Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>;

const initialState: TaskState = {
    tasks: [],
    theme: 'light',
    filter: 'all',
    sortOrder: 'newest',
    searchQuery: '',
    isSidebarOpen: false,
    toast: null,
    loading: false,
    error: null,
};

// GET ALL TASKS
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            return await getTasks();
        } catch {
            return rejectWithValue('Failed to fetch tasks');
        }
    }
);

// CREATE TASK
export const addTask = createAsyncThunk(
    'tasks/addTask',
    async (task: CreateTaskPayload, { rejectWithValue }) => {
        try {
            return await createTaskAPI(task);
        } catch {
            return rejectWithValue('Failed to create task');
        }
    }
);

// UPDATE TASK
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (
        payload: { id: string; updates: Partial<Task> },
        { rejectWithValue }
    ) => {
        try {
            return await updateTaskAPI(payload.id, payload.updates);
        } catch {
            return rejectWithValue('Failed to update task');
        }
    }
);

// TOGGLE COMPLETE
export const toggleComplete = createAsyncThunk(
    'tasks/toggleComplete',
    async (id: string, { rejectWithValue }) => {
        try {
            return await toggleTaskCompleteAPI(id);
        } catch {
            return rejectWithValue('Failed to update task status');
        }
    }
);

// DELETE TASK
export const handleDelete = createAsyncThunk(
    'tasks/deleteTask',
    async (id: string, { rejectWithValue }) => {
        try {
            await deleteTaskAPI(id);
            return id;
        } catch {
            return rejectWithValue('Failed to delete task');
        }
    }
);

// CLEAR COMPLETED
export const handleClearCompleted = createAsyncThunk(
    'tasks/clearCompleted',
    async (_, { rejectWithValue }) => {
        try {
            await clearCompletedTasksAPI();
            return true;
        } catch {
            return rejectWithValue('Failed to clear completed tasks');
        }
    }
);

const taskSlice = createSlice({
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

        setSortOrder: (
            state,
            action: PayloadAction<'newest' | 'oldest' | 'asc' | 'desc'>
        ) => {
            state.sortOrder = action.payload;
        },

        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },

        setIsSidebarOpen: (
            state,
            action: PayloadAction<boolean | undefined>
        ) => {
            state.isSidebarOpen =
                action.payload !== undefined
                    ? action.payload
                    : !state.isSidebarOpen;
        },

        setToast: (state, action: PayloadAction<string | null>) => {
            state.toast = action.payload;
        },

        clearToast: (state) => {
            state.toast = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // FETCH TASKS
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // CREATE TASK
            .addCase(addTask.fulfilled, (state, action) => {
                state.tasks.unshift(action.payload);
                state.toast = 'Task created successfully!';
            })
            .addCase(addTask.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // UPDATE TASK
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(
                    task => task.id === action.payload.id
                );

                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }

                state.toast = 'Task updated successfully!';
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // TOGGLE COMPLETE
            .addCase(toggleComplete.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(
                    task => task.id === action.payload.id
                );

                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }

                state.toast = 'Task status updated';
            })
            .addCase(toggleComplete.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // DELETE TASK
            .addCase(handleDelete.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(
                    task => task.id !== action.payload
                );

                state.toast = 'Task deleted';
            })
            .addCase(handleDelete.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // CLEAR COMPLETED
            .addCase(handleClearCompleted.fulfilled, (state) => {
                state.tasks = state.tasks.filter(
                    task => !task.completed
                );

                state.toast = 'Cleared completed tasks';
            })
            .addCase(handleClearCompleted.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const {
    setTheme,
    toggleTheme,
    setFilter,
    setSortOrder,
    setSearchQuery,
    setIsSidebarOpen,
    setToast,
    clearToast,
} = taskSlice.actions;

// Selectors
export const selectTheme = (state: { tasks: TaskState }) => state.tasks;

export default taskSlice.reducer;