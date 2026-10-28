import React, { useState, useEffect } from 'react';
import { CloseOutlined, CalendarOutlined, TagsOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../store/slice/taskSlice';
import type { Task, Priority, Category } from '../types/task';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskToEdit?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
    const dispatch = useDispatch();

    // Local state for instant typing without lagging Redux
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium' as Priority,
        category: 'Work' as Category,
        dueDate: ''
    });

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                title: taskToEdit.title,
                description: taskToEdit.description || '',
                priority: taskToEdit.priority || 'medium',
                category: taskToEdit.category || 'Work',
                dueDate: taskToEdit.dueDate || ''
            });
        } else {
            setFormData({ title: '', description: '', priority: 'medium', category: 'Work', dueDate: '' });
        }
    }, [taskToEdit, isOpen]);

    if (!isOpen) return null;

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        if (taskToEdit) {
            dispatch(updateTask({ id: taskToEdit.id, updates: formData }));
        } else {
            dispatch(addTask(formData));
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {taskToEdit ? 'Edit Task Details' : 'Create New Task'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
                    >
                        <CloseOutlined className="text-base" />
                    </button>
                </div>

                <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Task Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            maxLength={80}
                            value={formData.title}
                            onChange={handleFieldChange}
                            placeholder="e.g., Add Your Task..."
                            className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Task Description</label>
                            <span className="text-[10px] text-slate-400">{formData.description.length}/150 chars</span>
                        </div>
                        <textarea
                            name="description"
                            rows={3}
                            maxLength={150}
                            value={formData.description}
                            onChange={handleFieldChange}
                            placeholder="Add notes, context, or sub-steps (max 150 characters)..."
                            className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Priority</label>
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <ExclamationCircleOutlined className="text-slate-400" />
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleFieldChange}
                                    className="w-full bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer uppercase"
                                >
                                    <option value="low" className="dark:bg-slate-800">Low</option>
                                    <option value="medium" className="dark:bg-slate-800">Med</option>
                                    <option value="high" className="dark:bg-slate-800">High</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Category</label>
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <TagsOutlined className="text-slate-400" />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleFieldChange}
                                    className="w-full bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                                >
                                    <option value="Work" className="dark:bg-slate-800">Work</option>
                                    <option value="Personal" className="dark:bg-slate-800">Personal</option>
                                    <option value="Ideas" className="dark:bg-slate-800">Ideas</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Due Date</label>
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <CalendarOutlined className="text-slate-400" />
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleFieldChange}
                                    className="w-full bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md cursor-pointer">
                            {taskToEdit ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;