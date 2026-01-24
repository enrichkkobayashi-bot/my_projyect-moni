
import React, { useEffect } from 'react';
import { MonitoringReport } from '../types';

interface ReportCardProps {
  report: MonitoringReport;
  onUpdate: (updated: MonitoringReport) => void;
  onReset: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onUpdate, onReset }) => {
  const autoResize = (target: HTMLTextAreaElement) => {
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  };

  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(ta => autoResize(ta as HTMLTextAreaElement));
  }, [report]);

  const isConversationSummary = report.reportType === 'conversation_summary';

  const getHeaderTitle = () => {
    if (isConversationSummary) return '会話メモ・要約';
    return 'モニタリング記録';
  };

  const getSectionTitle = () => {
    if (isConversationSummary) return '要約内容';
    return 'モニタリング記録（本文）';
  }

  const fields = [
    { key: 'time', label: '時間', value: report.extractedFields.time },
    { key: 'location', label: '訪問場所', value: report.extractedFields.location },
    { key: 'interviewee', label: '面会者', value: report.extractedFields.interviewee },
    { key: 'supportContent', label: '主な支援内容', value: report.extractedFields.supportContent },
    { key: 'condition', label: '体調確認', value: report.extractedFields.condition },
    { key: 'serviceStatus', label: 'サービス利用状況', value: report.extractedFields.serviceStatus },
    { key: 'satisfaction', label: 'サービスへの満足度', value: report.extractedFields.satisfaction },
    { key: 'familyStatus', label: '家族の状況', value: report.extractedFields.familyStatus },
    { key: 'intentions', label: '本人・家族の意向', value: report.extractedFields.intentions },
    { key: 'planValidity', label: 'ケアプランの妥当性', value: report.extractedFields.planValidity },
  ];

  const handleFieldChange = (key: string, value: string) => {
    onUpdate({
      ...report,
      extractedFields: {
        ...report.extractedFields,
        [key as keyof typeof report.extractedFields]: value
      }
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(report.summaryText);
    alert('モニタリング記録をクリップボードにコピーしました');
  };

  const exportAsText = () => {
    let content = `モニタリング記録\n作成日: ${report.date}\n\n`;
    content += `【モニタリング 本文】\n${report.summaryText}\n\n`;
    content += `【抽出データ】\n`;
    fields.forEach(f => content += `${f.label}: ${f.value}\n`);

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `モニタリング記録_${report.date.replace(/\//g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const charCount = report.summaryText.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 report-card">
      <div className="print-only mb-10 text-center border-b-4 border-black pb-4">
        <h1 className="text-3xl font-bold">{getHeaderTitle()}</h1>
        <p className="text-right mt-4 text-sm font-bold">作成日: {report.date}</p>
      </div>

      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{`生成された${getHeaderTitle()}`}</h2>
          <p className="text-sm text-slate-500 mt-1">作成日: {report.date}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-sm">
            <span>PDF保存</span>
          </button>
          <button onClick={exportAsText} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
            <span>テキスト保存</span>
          </button>
          <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            <span>コピー</span>
          </button>
          <button onClick={onReset} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-2 no-print">
            <label className="text-sm font-bold text-slate-700">{getSectionTitle()}</label>
            <span className={`text-xs font-medium ${charCount > (isConversationSummary ? 2000 : 1200) ? 'text-red-500' : 'text-slate-400'}`}>
              {charCount} 文字
            </span>
          </div>
          <textarea
            value={report.summaryText}
            onChange={(e) => onUpdate({ ...report, summaryText: e.target.value })}
            onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
            className="w-full min-h-[300px] px-4 py-4 bg-indigo-50 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 leading-relaxed no-print overflow-hidden"
          />
          <div className="print-only whitespace-pre-wrap leading-relaxed text-[10pt] border border-slate-200 p-4 rounded-lg">
            {report.summaryText}
          </div>
        </section>

        {!isConversationSummary && (
          <section className="bg-slate-50 rounded-xl p-6 border border-slate-100 print:bg-white print:border-none print:p-0">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 print:text-lg print:text-black print:border-black print:mb-6">抽出・補足データ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {fields.map((field) => (
                <div key={field.key} className="print:mb-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1 print:text-sm print:text-black print:font-bold">{field.label}:</label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 no-print"
                  />
                  <div className="print-only border-b border-gray-300 pb-1 text-[9pt]">{field.value || 'ー'}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
