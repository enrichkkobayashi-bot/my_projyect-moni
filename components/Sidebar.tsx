import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'モニタリング', path: 'https://enrichkkobayashi-bot.github.io/my_projyect-moni/' },
        { name: '担当者会議', path: 'http://my-project-kaigi.vercel.app/' },
        { name: '要介護プラン', path: 'https://enrichkkobayashi-bot.github.io/kaigo-plan-system/' },
        { name: '要支援プラン', path: 'https://care-plan-assistant.vercel.app' },
        { name: '入院時情報連携', path: 'https://carelink-ai-sheet.vercel.app' },
    ];

    return (
        <aside className="fixed top-0 left-0 w-64 h-full bg-[#0F172A] text-white flex flex-col no-print z-50 overflow-y-auto">
            {/* Brand Header */}
            <div className="p-6 flex items-center gap-3 border-b border-gray-800">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <span className="text-xl font-bold tracking-tight">CareLink</span>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-10 px-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 px-4">
                    Navigation
                </div>
                <nav className="space-y-2">
                    {menuItems.map((item, index) => {
                        const isExternal = item.path.startsWith('http');
                        const isActive = !isExternal && location.pathname === item.path;

                        const className = `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`;

                        const content = (
                            <>
                                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-600 group-hover:bg-gray-400'}`}></span>
                                <span className="font-medium text-sm">{item.name}</span>
                                {isExternal && (
                                    <svg className="w-4 h-4 ml-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                )}
                            </>
                        );

                        if (isExternal) {
                            return (
                                <a
                                    key={index}
                                    href={item.path}
                                    className={className}
                                    target="_blank"
                                    rel="noopener noreferrer"
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

            {/* User Profile Footer */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold shadow-inner">
                        CM
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white">鈴木 太郎</div>
                        <div className="text-xs text-gray-400">ケアマネージャー</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export { Sidebar };
