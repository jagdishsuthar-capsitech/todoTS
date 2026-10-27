import React from 'react';
import TaskCard from './TaskCard';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectTheme } from '../store/slice/taskSlice';

const TaskList: React.FC = () => {
    const { tasks, filter, searchQuery, sortOrder } = useSelector(selectTheme);

    const filteredTasks = tasks.filter(task => {
        const taskTitle = task.title || '';
        const taskDesc = task.description || '';
        const taskCat = task.category || '';

        const matchesSearch = taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            taskDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            taskCat.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === 'completed') return task.completed;
        if (filter === 'active') return !task.completed;
        if (filter === 'high') return task.priority === 'high' && !task.completed;
        if (filter === 'Work' || filter === 'Personal' || filter === 'Ideas') return task.category === filter && !task.completed;

        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortOrder === 'oldest') return a.createdAt - b.createdAt;
        if (sortOrder === 'asc') return a.title.localeCompare(b.title);
        if (sortOrder === 'desc') return b.title.localeCompare(a.title);
        return b.createdAt - a.createdAt;
    });

    return (
        <div>
            {sortedTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center px-4">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-3">
                        <UnorderedListOutlined className="text-2xl" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">No tasks found</h3>
                    <p className="text-xs text-slate-400 max-w-xs">Click the "+ Add Task" button in the top right to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
            )}
        </div>
    );
};

export default TaskList;