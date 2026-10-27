import React, { useState, useEffect, useRef } from 'react';
import { MenuOutlined, SunOutlined, MoonOutlined, SearchOutlined, PlusOutlined, BellOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setSearchQuery, setIsSidebarOpen, openCreateModal, selectTheme } from '../store/slice/taskSlice';

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const { theme, searchQuery, tasks } = useSelector(selectTheme);
    
    const searchInputRef = useRef<HTMLInputElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    const [isNotifOpen, setIsNotifOpen] = useState(false);

    // Local handler functions
    const handleOpenSidebar = () => dispatch(setIsSidebarOpen(undefined));
    const handleTriggerSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(setSearchQuery(e.target.value));
    const handleTriggerThemeToggle = () => dispatch(toggleTheme());
    const handleOpenCreateTaskModal = () => dispatch(openCreateModal());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        };
        if (isNotifOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNotifOpen]);

    const oneDaysInMs = 1 * 24 * 60 * 60 * 1000;
    const taskList = Array.isArray(tasks) ? tasks : [];
    const pendingStaleTasks = taskList.filter(t => !t.completed && (Date.now() - t.createdAt) > oneDaysInMs);
    const unreadCount = pendingStaleTasks.length;

    return (
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 relative z-40">
            <div className="flex items-center gap-4">
                <button
                    onClick={handleOpenSidebar}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer md:hidden"
                    title="Toggle Menu"
                >
                    <MenuOutlined className="text-lg" />
                </button>

                <div className="relative hidden sm:block w-72">
                    <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleTriggerSearchChange}
                        placeholder="Search tasks, descriptions..."
                        className="w-full pl-9 pr-12 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded text-[10px] font-mono">
                        <span>CTRL + K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <button
                    onClick={handleTriggerThemeToggle}
                    className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <SunOutlined className="text-amber-400 text-base" /> : <MoonOutlined className="text-indigo-600 text-base" />}
                </button>

                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        title="Notifications"
                    >
                        <BellOutlined className="text-base" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                        )}
                    </button>

                    {isNotifOpen && (
                        <div className="fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:right-0 sm:mt-2 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                                <div className="flex items-center gap-2">
                                    <BellOutlined className="text-indigo-600" />
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</h4>
                                </div>
                                <button
                                    onClick={() => setIsNotifOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer p-1"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {pendingStaleTasks.length > 0 ? (
                                    pendingStaleTasks.map(task => (
                                        <div key={task.id} className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs">
                                            <p className="font-semibold text-amber-800 dark:text-amber-300 line-clamp-1">⚠️ {task.title}</p>
                                            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">Pending work, Complete your work!</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-6 text-center text-slate-400 text-xs">
                                        No pending alerts. All caught up! 🎉
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleOpenCreateTaskModal}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-md transition-colors cursor-pointer"
                >
                    <PlusOutlined />
                    <span>Add Task</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;