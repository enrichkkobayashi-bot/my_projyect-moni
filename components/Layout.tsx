import React from 'react';
import { Sidebar } from './Sidebar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 transition-all duration-300 print:pl-0">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-800">ケアマネモニタリングサポーター</h1>
            </div>
            <div className="text-sm text-slate-500 font-medium">
              Gemini AI Powered
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-sm print:hidden">
          © 2024 CareManager Support AI. 全ての記録は機密事項として扱われます。
        </footer>
      </div>
    </div>
  );
};
