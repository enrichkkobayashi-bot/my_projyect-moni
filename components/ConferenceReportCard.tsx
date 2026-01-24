
import React, { useEffect } from 'react';
import { ConferenceReport } from '../types';

interface ConferenceReportCardProps {
  report: ConferenceReport;
  onUpdate: (updated: ConferenceReport) => void;
  onReset: () => void;
}

export const ConferenceReportCard: React.FC<ConferenceReportCardProps> = ({ report, onUpdate, onReset }) => {
  const autoResize = (target: HTMLTextAreaElement) => {
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  };

  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(ta => autoResize(ta as HTMLTextAreaElement));
  }, [report]);

  const handleParticipantChange = (index: number, field: 'role' | 'name', value: string) => {
    const newParticipants = [...report.participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    onUpdate({ ...report, participants: newParticipants });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 report-card">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 no-print">
        <h2 className="text-xl font-bold text-slate-800">サービス担当者会議録</h2>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm">PDF出力</button>
          <button onClick={onReset} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <section className="bg-white border-2 border-slate-800 p-4 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-black text-slate-500 mb-1">利用者名</label>
              <input type="text" value={report.userName} onChange={(e) => onUpdate({...report, userName: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-black text-slate-500 mb-1">作成担当者</label>
              <input type="text" value={report.createdBy} onChange={(e) => onUpdate({...report, createdBy: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-black text-slate-500 mb-1">開催日</label>
              <input type="text" value={report.holdingDate} onChange={(e) => onUpdate({...report, holdingDate: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
            </div>
          </div>
        </section>

        <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">出席者</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {report.participants.map((p, i) => (
              <div key={i} className="bg-white border border-slate-200 p-2 rounded-lg flex flex-col gap-1">
                <input type="text" placeholder="所属" value={p.role} onChange={(e) => handleParticipantChange(i, 'role', e.target.value)} className="text-[10px] px-2 py-1 bg-slate-50 rounded" />
                <input type="text" placeholder="氏名" value={p.name} onChange={(e) => handleParticipantChange(i, 'name', e.target.value)} className="w-full text-xs px-2 py-1 font-bold border rounded" />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-md font-bold text-slate-700">１．検討項目</h3>
          {report.discussionItems.map((item, i) => (
            <input key={i} type="text" value={item} onChange={(e) => {
              const newItems = [...report.discussionItems];
              newItems[i] = e.target.value;
              onUpdate({...report, discussionItems: newItems});
            }} className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50" />
          ))}
        </section>

        <section className="space-y-4">
          <h3 className="text-md font-bold text-slate-700">２．検討内容</h3>
          {report.discussionDetails.map((detail, i) => (
            <textarea key={i} value={detail} onChange={(e) => {
              const newDetails = [...report.discussionDetails];
              newDetails[i] = e.target.value;
              onUpdate({...report, discussionDetails: newDetails});
            }} onInput={(e) => autoResize(e.target as HTMLTextAreaElement)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm leading-relaxed" />
          ))}
        </section>

        <section>
          <h3 className="text-md font-bold text-slate-700 mb-2">３．結論</h3>
          <textarea value={report.conclusion} onChange={(e) => onUpdate({...report, conclusion: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" />
        </section>

        <section>
          <h3 className="text-md font-bold text-slate-700 mb-2">４．残された課題</h3>
          <textarea value={report.remainingIssues} onChange={(e) => onUpdate({...report, remainingIssues: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" />
        </section>
      </div>
    </div>
  );
};
