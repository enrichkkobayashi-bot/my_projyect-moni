import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { FileUploader } from './components/FileUploader';
import { ReportCard } from './components/ReportCard';
import { ReportHistory } from './components/ReportHistory';
import { AppStatus, MonitoringReport, ReportType } from './types';
import { summarizeMonitoring, generateConversationSummary } from './services/geminiService';

interface QueuedFile {
  base64: string;
  name: string;
  type: string;
}

const REASSURING_MESSAGES = [
  "録音データの解析を開始しました...",
  "会話内容から重要事項を特定中...",
  "ケアプランの妥当性を検討しています...",
  "モニタリングの文章を専門的に構成中...",
  "最終的な要約を作成しています..."
];

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [pendingFiles, setPendingFiles] = useState<QueuedFile[]>([]);
  const [processingProgress, setProcessingProgress] = useState<string>("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [targetPercent, setTargetPercent] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [monitoringCharLimit, setMonitoringCharLimit] = useState<number>(1000);
  const [currentReport, setCurrentReport] = useState<MonitoringReport | null>(null);
  const [outputType, setOutputType] = useState<'monitoring' | 'conversation_summary'>('monitoring');
  const [error, setError] = useState<string | null>(null);

  const progressTimerRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === AppStatus.PROCESSING) {
      progressTimerRef.current = window.setInterval(() => {
        setProgressPercent(prev => {
          let next = prev;
          if (prev < targetPercent) {
            next = prev + Math.max(0.1, (targetPercent - prev) * 0.05);
          } else if (prev < 99.9) {
            next = prev + 0.01;
          }
          return Math.min(next, 100);
        });
      }, 100);
      const msgTimer = window.setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % REASSURING_MESSAGES.length);
      }, 4000);
      return () => {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        clearInterval(msgTimer);
      };
    }
  }, [status, targetPercent]);

  const handleFileAdd = (fileData: QueuedFile) => {
    setPendingFiles(prev => [...prev, fileData]);
  };

  const handleRemoveFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleStartAnalysis = async () => {
    if (pendingFiles.length === 0) return;
    setStatus(AppStatus.PROCESSING);
    setProgressPercent(0);
    setTargetPercent(10);
    setProcessingProgress("資料の解析準備中...");
    setError(null);
    setLoadingMessageIndex(0);

    try {
      const filePayload = pendingFiles.map(f => ({ base64: f.base64, type: f.type }));

      setTargetPercent(40);
      setProcessingProgress(outputType === 'monitoring' ? "音声およびテキストを解析中..." : "会話内容を要約中...");

      console.log("Starting analysis with mode:", outputType);

      let result;
      if (outputType === 'monitoring') {
        result = await summarizeMonitoring(filePayload, monitoringCharLimit);
      } else {
        result = await generateConversationSummary(filePayload);
      }

      console.log("Analysis Result:", result);

      if (!result || Object.keys(result).length === 0) {
        throw new Error("AIからの応答が空でした。");
      }

      setTargetPercent(90);
      setCurrentReport({
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString('ja-JP'),
        summaryText: result.summaryText || "解析完了（要約テキストなし）",
        extractedFields: result.extractedFields || {
          time: "記載なし", location: "記載なし", interviewee: "記載なし", supportContent: "記載なし",
          condition: "記載なし", serviceStatus: "記載なし", satisfaction: "記載なし", familyStatus: "記載なし",
          intentions: "記載なし", planValidity: "記載なし"
        },
        transcript: "解析完了",
        reportType: outputType,

      });

      setTargetPercent(100);
      setProgressPercent(100);
      setTimeout(() => {
        setPendingFiles([]);
        setStatus(AppStatus.COMPLETED);
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    } catch (err) {
      console.error("Analysis Error:", err);
      setError("解析中にエラーが発生しました。");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setCurrentReport(null);
    setPendingFiles([]);
    setStatus(AppStatus.IDLE);
    setError(null);
    setProgressPercent(0);
    setTargetPercent(0);
  };

  const handleSaveToHistory = () => {
    if (!currentReport) return;
    try {
      const userName = currentReport.extractedFields.interviewee || "記載なし";
      const history = JSON.parse(localStorage.getItem('care_history') || '[]');
      const newEntry = {
        id: currentReport.id,
        type: 'monitoring',
        userName,
        date: currentReport.date,
        data: currentReport
      };
      const idx = history.findIndex((h: any) => h.id === currentReport.id);
      if (idx >= 0) history[idx] = newEntry; else history.unshift(newEntry);
      localStorage.setItem('care_history', JSON.stringify(history));
      setSaveToast(`${userName} 様の記録を保存しました`);
      setTimeout(() => setSaveToast(null), 3000);
    } catch (err: any) { alert("保存に失敗しました。"); }
  };

  const handleLoadFromHistory = (entry: any) => {
    handleReset();
    setCurrentReport(entry.data);
    setOutputType(entry.data.reportType || 'monitoring');
    setStatus(AppStatus.COMPLETED);
    setShowHistory(false);
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto" ref={scrollRef}>
        {saveToast && (
          <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              {saveToast}
            </div>
          </div>
        )}

        {status === AppStatus.IDLE && !showHistory && (
          <div className="space-y-8 animate-in fade-in duration-500 text-center">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">モニタリング・アシスタント</h1>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowHistory(true)} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                過去の記録
              </button>
            </div>

            <div className="mt-4 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">要約文字数の目安</label>
              <div className="flex gap-2">
                {[800, 1000, 1200].map(val => (
                  <button key={val} onClick={() => setMonitoringCharLimit(val)} className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${monitoringCharLimit === val ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
                    {val}文字
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-500 delay-100">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">出力モード</label>
              <div className="flex gap-2 p-1 bg-slate-100/50 rounded-full border border-slate-200">
                <button
                  onClick={() => setOutputType('monitoring')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative z-10 ${outputType === 'monitoring' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  モニタリング記録
                </button>
                <button
                  onClick={() => setOutputType('conversation_summary')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative z-10 ${outputType === 'conversation_summary' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  会話メモ・要約
                </button>

              </div>
            </div>

            <FileUploader status={status} onFileAdd={handleFileAdd} onStartAnalysis={handleStartAnalysis} pendingFiles={pendingFiles} onRemoveFile={handleRemoveFile} />
          </div>
        )}

        {showHistory && <ReportHistory onLoad={handleLoadFromHistory} onClose={() => setShowHistory(false)} />}

        {status === AppStatus.PROCESSING && (
          <div className="bg-white rounded-[2.5rem] p-12 md:p-24 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-50"><div className="h-full bg-indigo-600 transition-all" style={{ width: `${progressPercent}%` }}></div></div>
            <div className="relative flex justify-center mb-12"><div className="w-24 h-24 border-[6px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div><div className="absolute inset-0 flex items-center justify-center font-black text-indigo-700">{Math.floor(progressPercent)}%</div></div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">{REASSURING_MESSAGES[loadingMessageIndex]}</h2>
            <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase">{processingProgress}</p>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="p-12 text-center bg-red-50 rounded-[2.5rem] border border-red-200">
            <h2 className="text-red-900 font-bold text-2xl mb-4">解析に失敗しました</h2>
            <p className="text-red-700 mb-8">{error}</p>
            <button onClick={() => setStatus(AppStatus.IDLE)} className="px-12 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg">やり直す</button>
          </div>
        )}

        {status === AppStatus.COMPLETED && currentReport && (
          <div className="animate-in fade-in duration-700">
            <div className="no-print flex justify-center mb-4 sticky top-4 z-30">
              <button onClick={handleSaveToHistory} className="bg-indigo-600 text-white px-10 py-4 rounded-full font-black shadow-2xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                この内容を保存する
              </button>
            </div>
            <ReportCard report={currentReport} onUpdate={setCurrentReport} onReset={handleReset} />
          </div>
        )}
      </div>
    </Layout>
  );
};
export default App;