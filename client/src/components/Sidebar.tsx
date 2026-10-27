import React from 'react';
import { CheckSquareOutlined, StarOutlined, FolderOutlined, UserOutlined, BulbOutlined, CheckCircleOutlined, DashboardOutlined, CloseOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, setFilter, setIsSidebarOpen } from '../store/slice/taskSlice';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch();
    const { filter, tasks: allTasks, isSidebarOpen } = useSelector(selectTheme);

    const getCount = (type: string) => {
        if (type === 'all') return allTasks.length;
        if (type === 'active') return allTasks.filter(t => !t.completed).length;
        if (type === 'completed') return allTasks.filter(t => t.completed).length;
        if (type === 'high') return allTasks.filter(t => t.priority === 'high' && !t.completed).length;
        return allTasks.filter(t => t.category === type && !t.completed).length;
    };

    const navItems = [
        { id: 'all', label: 'All Tasks', icon: DashboardOutlined },
        { id: 'active', label: 'Active', icon: CheckSquareOutlined },
        { id: 'high', label: 'High Priority', icon: StarOutlined, badgeColor: 'text-rose-500' },
        { id: 'completed', label: 'Completed', icon: CheckCircleOutlined },
    ];

    const categories = [
        { id: 'Work', label: 'Work', icon: FolderOutlined },
        { id: 'Personal', label: 'Personal', icon: UserOutlined },
        { id: 'Ideas', label: 'Ideas', icon: BulbOutlined },
    ];

    const handleSelectFilter = (id: string) => {
        dispatch(setFilter(id));
        if (window.innerWidth < 768) dispatch(setIsSidebarOpen(false));
    };

    const handleCloseSidebar = () => dispatch(setIsSidebarOpen(false));

    return (
        <>
            {isSidebarOpen && (
                <div onClick={handleCloseSidebar} className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs md:hidden" />
            )}

            <aside className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 md:transition-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
                            <CheckSquareOutlined className="text-base" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Task<span className="text-indigo-600">fy</span>
                        </span>
                    </div>
                    <button onClick={handleCloseSidebar} className="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                        <CloseOutlined />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                    <div>
                        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Workspace</p>
                        <div className="space-y-1">
                            {navItems.map((item) => {
                                const IconComponent = item.icon;
                                const isActive = filter === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSelectFilter(item.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <IconComponent className={`text-base ${item.badgeColor || ''}`} />
                                            <span>{item.label}</span>
                                        </div>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            {getCount(item.id)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Categories</p>
                        <div className="space-y-1">
                            {categories.map((cat) => {
                                const IconComponent = cat.icon;
                                const isActive = filter === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleSelectFilter(cat.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <IconComponent className="text-base text-slate-400" />
                                            <span>{cat.label}</span>
                                        </div>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            {getCount(cat.id)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;