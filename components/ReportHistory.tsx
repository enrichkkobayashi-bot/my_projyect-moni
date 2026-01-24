import React, { useState, useEffect } from 'react';
import { ReportType } from '../types';

interface HistoryEntry {
  id: string;
  type: ReportType;
  userName: string;
  date: string;
  data: any;
}

interface ReportHistoryProps {
  onLoad: (entry: HistoryEntry) => void;
  onClose: () => void;
}

export const ReportHistory: React.FC<ReportHistoryProps> = ({ onLoad, onClose }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('care_history') || '[]');
    setHistory(saved);
  }, []);

  const deleteEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("この記録を削除してもよろしいですか？")) return;
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('care_history', JSON.stringify(newHistory));
  };

  const filteredHistory = history.filter(h => 
    h.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">保存されたモニタリング記録</h2>
          <p className="text-sm text-slate-500 mt-1">利用者ごとに過去の記録を管理できます</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text"
            placeholder="利用者名で検索..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">記録は見つかりませんでした</p>
          </div>
        ) : (
          filteredHistory.map((entry) => (
            <div 
              key={entry.id}
              onClick={() => onLoad(entry)}
              className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{entry.userName} 様</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">{entry.date}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={(e) => deleteEntry(entry.id, e)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};