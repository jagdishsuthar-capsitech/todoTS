import React from 'react';
import { SwapOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { setSortOrder, handleClearCompleted, selectTheme } from '../store/slice/taskSlice';
import type { AppDispatch } from '../store/store';

const TaskFilters: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { sortOrder, tasks } = useSelector(selectTheme);
    const completedTasksCount = tasks.filter(t => t.completed).length;

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(
            setSortOrder(e.target.value as 'newest' | 'oldest' | 'asc' | 'desc')
        );
    };

    const handleClearDoneTasks = () => {
        dispatch(handleClearCompleted());
    };

    return (
        <div className="flex items-center justify-between pb-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Tasks Grid View
            </p>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-600 dark:text-slate-300">
                    <SwapOutlined className="text-slate-400" />

                    <select value={sortOrder} onChange={handleSortChange} className="bg-transparent outline-none cursor-pointer font-medium">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="asc">Alphabetical (A-Z)</option>
                        <option value="desc">Alphabetical (Z-A)</option>
                    </select>
                </div>

                {completedTasksCount > 0 && (
                    <button onClick={handleClearDoneTasks} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer">
                        <DeleteOutlined />
                        <span>Clear ({completedTasksCount})</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskFilters;