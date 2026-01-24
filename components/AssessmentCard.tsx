import React, { useEffect, useState, useRef } from 'react';
import { AssessmentReport, ChecklistItem, PreventiveCarePlan } from '../types';
import { generateAssessmentPhase, generateCarePlanFromAssessment, generateSupportChecklist, generatePreventivePlan } from '../services/geminiService';

interface AssessmentCardProps {
  report: AssessmentReport;
  onUpdate: (updated: AssessmentReport) => void;
  onReset: () => void;
  originalFiles?: { base64: string, type: string }[];
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ report, onUpdate, onReset, originalFiles }) => {
  const [isAnalyzingItems, setIsAnalyzingItems] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  
  const isSupport = report.category === 'support';
  const hasItems = Object.keys(report.items || {}).length > 5;

  const autoResize = (target: HTMLTextAreaElement) => {
    target.style.height = 'auto';
    target.style.height = (target.scrollHeight + 2) + 'px';
  };

  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(ta => autoResize(ta as HTMLTextAreaElement));
  }, [report, isAnalyzingItems]);

  const handleBasicInfoUpdate = (field: string, value: string) => {
    onUpdate({ ...report, basicInfo: { ...report.basicInfo, [field]: value } });
  };

  const handleAnalyzeItems = async () => {
    if (!originalFiles || originalFiles.length === 0) return;
    setIsAnalyzingItems(true);
    try {
      if (isSupport) {
        setProgressMsg("基本チェックリスト生成中...");
        const checklist = await generateSupportChecklist(originalFiles);
        const bItems = await generateAssessmentPhase(originalFiles, 'B');
        onUpdate({ ...report, items: bItems, checklist });
      } else {
        setProgressMsg("詳細アセスメント解析中...");
        const bItems = await generateAssessmentPhase(originalFiles, 'B');
        const cItems = await generateAssessmentPhase(originalFiles, 'C');
        const defItems = await generateAssessmentPhase(originalFiles, 'DEF');
        onUpdate({ ...report, items: { ...bItems, ...cItems, ...defItems } });
      }
      setIsAnalyzingItems(false);
    } catch (err) {
      setIsAnalyzingItems(false);
      alert("解析エラーが発生しました。");
    }
  };

  const renderField = (label: string, field: string, span: string = "col-span-1", labelBg: string = "bg-slate-100") => (
    <div className={`border-r border-b border-black flex flex-col ${span} min-h-[40px]`}>
      <div className={`${labelBg} text-[7pt] px-1 border-b border-black font-bold`}>{label}</div>
      <textarea 
        className="text-[8.5pt] p-1 w-full outline-none font-bold resize-none overflow-hidden bg-transparent" 
        value={(report.basicInfo as any)[field] || ""} 
        onChange={(e) => handleBasicInfoUpdate(field, e.target.value)} 
        onInput={(e) => autoResize(e.target as HTMLTextAreaElement)} 
        rows={1} 
      />
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      {isAnalyzingItems && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-12 max-w-xl w-full text-center shadow-2xl">
            <h2 className="text-xl font-black mb-4">{progressMsg}</h2>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      )}

      <div className="no-print flex justify-end gap-2 sticky top-16 z-40 bg-slate-100/90 p-3 rounded-b-2xl shadow-xl">
        <button onClick={() => window.print()} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow">PDF出力</button>
        <button onClick={onReset} className="bg-white text-slate-600 px-4 py-2 rounded-xl text-xs font-black border">新規</button>
      </div>

      <div className="max-w-[1000px] mx-auto space-y-8">
        {!isSupport ? (
          <div className="bg-white p-6 shadow-sm border-2 border-black form-sheet">
            <div className="flex justify-between items-end mb-4 border-b-4 border-black pb-1">
              <h2 className="text-2xl font-black italic">フェイスシート</h2>
              <div className="text-[10pt] font-bold">作成日: {report.date}</div>
            </div>

            {/* １．利用者情報・認定情報 */}
            <div className="border-t border-l border-black mb-6">
              <div className="bg-slate-800 text-white text-[8pt] px-2 font-bold py-1 border-r border-b border-black uppercase tracking-widest">１．利用者情報・認定情報</div>
              <div className="grid grid-cols-6">
                {renderField("利用者氏名", "userName", "col-span-2", "bg-indigo-50")}
                {renderField("性別", "gender", "col-span-1", "bg-indigo-50")}
                {renderField("生年月日", "birthDate", "col-span-2", "bg-indigo-50")}
                {renderField("年齢", "age", "col-span-1", "bg-indigo-50")}
                {renderField("現住所", "address", "col-span-4")}
                {renderField("電話番号", "tel", "col-span-1")}
                {renderField("携帯番号", "mobile", "col-span-1")}
                {renderField("E-mail", "email", "col-span-6")}
                {renderField("要介護度", "careLevel", "col-span-1", "bg-amber-50")}
                {renderField("認定年月日", "certificationDate", "col-span-1", "bg-amber-50")}
                {renderField("認定有効期間", "certificationPeriod", "col-span-4", "bg-amber-50")}
                {renderField("障害高齢者の日常生活自立度", "adlRank", "col-span-3")}
                {renderField("認知症高齢者の日常生活自立度", "dementiaRank", "col-span-3")}
              </div>
            </div>

            {/* ２．健康状態 */}
            <div className="border-t border-l border-black mb-6">
              <div className="bg-slate-800 text-white text-[8pt] px-2 font-bold py-1 border-r border-b border-black uppercase tracking-widest">２．健康状態</div>
              <div className="grid grid-cols-6">
                {renderField("病名", "diseaseName", "col-span-3")}
                {renderField("発症年月日", "onsetDate", "col-span-3")}
                {renderField("薬の有無", "medication", "col-span-2")}
                {renderField("受診状況・頻度", "visitFrequency", "col-span-4")}
                {renderField("医療機関", "medicalOrg", "col-span-2")}
                {renderField("主治医", "doctorName", "col-span-2")}
                {renderField("連絡先", "medicalContact", "col-span-2")}
                {renderField("特記事項", "specialNotes", "col-span-6")}
              </div>
            </div>

            {/* ３．家族情報・本人・家族の意向 */}
            <div className="border-t border-l border-black mb-6">
              <div className="bg-slate-800 text-white text-[8pt] px-2 font-bold py-1 border-r border-b border-black uppercase tracking-widest">３．家族情報・本人・家族の意向</div>
              <div className="grid grid-cols-1">
                {renderField("生活歴（これまでの生活）", "lifeHistory")}
                {renderField("現在の状況", "currentSituation")}
                {renderField("趣味", "hobbies")}
                {renderField("１日の過ごし方", "dailyRhythm")}
                {renderField("家族の連絡先", "familyMembers")}
              </div>
              <div className="grid grid-cols-2">
                <div className="border-r border-b border-black flex flex-col min-h-[150px]">
                  <div className="bg-slate-100 text-[7pt] px-1 border-b border-black font-bold">【ジェノグラム】</div>
                  <textarea className="text-[8pt] p-2 flex-1 outline-none font-medium resize-none overflow-hidden bg-transparent" value={report.basicInfo.genogram} onChange={(e) => handleBasicInfoUpdate("genogram", e.target.value)} onInput={(e) => autoResize(e.target as HTMLTextAreaElement)} />
                </div>
                <div className="border-r border-b border-black flex flex-col min-h-[150px]">
                  <div className="bg-slate-100 text-[7pt] px-1 border-b border-black font-bold">【間取り図】</div>
                  <textarea className="text-[8pt] p-2 flex-1 outline-none font-medium resize-none overflow-hidden bg-transparent" value={report.basicInfo.houseLayout} onChange={(e) => handleBasicInfoUpdate("houseLayout", e.target.value)} onInput={(e) => autoResize(e.target as HTMLTextAreaElement)} />
                </div>
              </div>
            </div>

            {/* ４．居住環境・背景 */}
            <div className="border-t border-l border-black">
              <div className="bg-slate-800 text-white text-[8pt] px-2 font-bold py-1 border-r border-b border-black uppercase tracking-widest">４．居住環境・背景</div>
              <div className="grid grid-cols-1">
                {renderField("社会保障制度", "socialSecurity")}
                {renderField("利用している社会資源", "economicStatus")}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 shadow-sm border-2 border-black form-sheet">
             <div className="flex justify-between items-end mb-4 border-b-4 border-black pb-1">
              <h2 className="text-2xl font-black italic">利用者基本情報</h2>
              <div className="text-[10pt] font-bold">作成日: {report.date}</div>
            </div>
            <div className="border-t border-l border-black">
                {renderField("氏名", "userName", "col-span-4")}
                {renderField("性別", "gender", "col-span-1")}
                {renderField("生年月日", "birthDate", "col-span-1")}
                {renderField("介護度", "careLevel", "col-span-6")}
                {renderField("住所", "address", "col-span-6")}
            </div>
          </div>
        )}

        {!hasItems && (
          <div className="no-print bg-indigo-600 rounded-[2.5rem] p-12 text-center text-white shadow-2xl">
            <h3 className="text-xl font-black mb-4">情報の抽出が完了しました</h3>
            <p className="mb-6 opacity-80">続いて、会話内容から詳細なアセスメント項目を解析します。</p>
            <button onClick={handleAnalyzeItems} disabled={isAnalyzingItems} className="bg-white text-indigo-700 px-12 py-4 rounded-full font-black text-lg hover:bg-slate-100 transition-all">
              詳細解析を開始
            </button>
          </div>
        )}
      </div>
    </div>
  );
};