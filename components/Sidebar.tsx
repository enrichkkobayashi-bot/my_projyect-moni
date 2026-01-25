import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const location = useLocation();

    // Icons defined as simple SVG components for clarity and reusability
    const MonitorIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );

    const UsersIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );

    const DocumentIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    const HeartIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    );

    const HospitalIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    );

    const menuItems = [
        { name: 'モニタリング', path: 'https://my-project-moni.vercel.app', icon: MonitorIcon },
        { name: '担当者会議', path: 'https://my-project-kaigi.vercel.app/', icon: UsersIcon },
        { name: '要介護プラン', path: 'https://kaigo-plan-system.vercel.app', icon: DocumentIcon },
        { name: '要支援プラン', path: 'https://care-plan-assistant.vercel.app', icon: HeartIcon },
        { name: '入院時情報連携', path: 'https://carelink-ai-sheet.vercel.app', icon: HospitalIcon },
    ];

    return (
        <aside className="fixed top-0 left-0 w-64 h-full bg-[#0F172A] text-white flex flex-col no-print z-50 overflow-y-auto font-sans">
            {/* Brand Header */}
            <div className="p-6 flex items-center gap-3 border-b border-gray-800/50">
                <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">CareLink</span>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-8 px-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 px-4">
                    Navigation
                </div>
                <nav className="space-y-2">
                    {menuItems.map((item, index) => {
                        const isExternal = item.path.startsWith('http');
                        const isActive = !isExternal && location.pathname === item.path;
                        const Icon = item.icon;

                        const className = `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`;

                        const content = (
                            <>
                                <Icon />
                                <span className="font-medium text-[15px]">{item.name}</span>
                            </>
                        );

                        if (isExternal) {
                            return (
                                <a
                                    key={index}
                                    href={item.path}
                                    className={className}
                                // target="_blank" // Removed target blank per user request often implied for nav
                                // rel="noopener noreferrer"
                                >
                                    {content}
                                </a>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className={className}
                            >
                                {content}
                            </Link>
                        );
                    })}
                </nav>
            </div>


        </aside>
    );
};

export { Sidebar };
