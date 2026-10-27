import React, { useState } from 'react';
import { CheckCircleOutlined, BorderOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, TagsOutlined, WarningOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { toggleComplete, handleEditClick, handleDelete } from '../store/slice/taskSlice';
import type { Task } from '../types/task';

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const dispatch = useDispatch();
    const [isDeleting, setIsDeleting] = useState(false);

    // Component-level action handlers
    const handleToggleCompletion = () => dispatch(toggleComplete(task.id));
    const handleOpenEditModal = () => dispatch(handleEditClick(task));
    const handleConfirmDelete = () => dispatch(handleDelete(task.id));

    const priorityBadges: Record<string, string> = {
        high: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
        medium: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
        low: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50'
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const isOverdue = task.dueDate && task.dueDate < todayStr && !task.completed;
    const isDueToday = task.dueDate === todayStr && !task.completed;

    return (
        <div className={`relative overflow-hidden flex flex-col justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border transition-all shadow-sm hover:shadow-md ${task.completed ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/10 dark:bg-emerald-950/10' : 'border-slate-200 dark:border-slate-800'}`}>
            
            {isDeleting && (
                <div className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center animate-fadeIn">
                    <div className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl mb-2">
                        <WarningOutlined className="text-lg" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">Are you sure you want to delete?</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">"{task.title}"</p>
                    
                    <div className="flex items-center gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => setIsDeleting(false)}
                            className="flex-1 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmDelete}
                            className="flex-1 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm cursor-pointer"
                        >
                            Yes
                        </button>
                    </div>
                </div>
            )}

            <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={handleToggleCompletion}
                            className="mt-0.5 transition-transform active:scale-90 shrink-0 cursor-pointer"
                        >
                            {task.completed ? (
                                <CheckCircleOutlined className="text-lg text-emerald-600" />
                            ) : (
                                <BorderOutlined className="text-lg text-slate-300 dark:text-slate-600 hover:text-slate-500" />
                            )}
                        </button>
                        <h3 className={`text-sm font-bold tracking-tight line-clamp-1 ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                            {task.title}
                        </h3>
                    </div>

                    {task.priority && (
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${priorityBadges[task.priority]}`}>
                            {task.priority}
                        </span>
                    )}
                </div>

                <p className={`text-xs line-clamp-3 mb-4 pl-8 ${task.completed ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                    {task.description || 'No description provided.'}
                </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-auto">
                <div className="flex flex-wrap items-center gap-2">
                    {task.category && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            <TagsOutlined />
                            {task.category}
                        </span>
                    )}

                    {task.dueDate && (
                        <div className="flex items-center gap-1">
                            <CalendarOutlined className="text-slate-400" />
                            <span className={`text-[10px] font-medium ${isOverdue ? 'text-rose-600 font-semibold' : isDueToday ? 'text-amber-600 font-semibold' : 'text-slate-400'}`}>
                                {isOverdue ? `Overdue` : isDueToday ? 'Today' : task.dueDate}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={handleOpenEditModal}
                        disabled={task.completed}
                        className={`p-1.5 rounded-xl transition-colors ${task.completed ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer'}`}
                    >
                        <EditOutlined />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsDeleting(true)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer"
                    >
                        <DeleteOutlined />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;