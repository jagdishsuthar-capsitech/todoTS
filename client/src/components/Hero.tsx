import { useEffect } from 'react';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { clearToast, selectTheme } from '../store/slice/taskSlice';

const Hero = () => {
    const { tasks, toast } = useSelector(selectTheme);
    const dispatch = useDispatch();

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                dispatch(clearToast()); 
            }, 3000);
            return () => clearTimeout(timer); 
        }
    }, [toast, dispatch]);

    const totalTasks = tasks.length;
    const completedTasksCount = tasks.filter((t) => t.completed).length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

    return (
        <div className="max-w-full mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Workspace Overview</h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Manage tasks in grid cards with title and detailed descriptions.</p>
                    </div>

                    <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 sm:w-56">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <CheckCircleOutlined className="text-indigo-600" />
                                Progress
                            </span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">{completedTasksCount}/{totalTasks} ({progressPercentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <TaskFilters />
            <TaskList />
            <TaskModal />

            {toast && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded shadow-xl text-xs font-semibold">
                    <span className="text-sm font-semibold">{toast}</span>
                </div>
            )}
        </div>
    );
};

export default Hero;