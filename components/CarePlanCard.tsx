
import React from 'react';
import { CarePlanReport } from '../types';

interface CarePlanCardProps {
  report: CarePlanReport;
  onUpdate: (updated: CarePlanReport) => void;
  onReset: () => void;
}

export const CarePlanCard: React.FC<CarePlanCardProps> = ({ report, onUpdate, onReset }) => {
  const handlePrint = () => window.print();

  const handleTable1Update = (field: 'userWill' | 'supportPolicy', value: string) => {
    onUpdate({
      ...report,
      table1: { ...report.table1, [field]: value }
    });
  };

  const handleTable2Update = (idx: number, field: string, value: any) => {
    const newTable2 = [...report.table2];
    newTable2[idx] = { ...newTable2[idx], [field]: value };
    onUpdate({ ...report, table2: newTable2 });
  };

  const handleServiceUpdate = (rowIdx: number, svcIdx: number, field: 'content' | 'provider', value: string) => {
    const newTable2 = [...report.table2];
    const newServices = [...newTable2[rowIdx].services];
    newServices[svcIdx] = { ...newServices[svcIdx], [field]: value };
    newTable2[rowIdx] = { ...newTable2[rowIdx], services: newServices };
    onUpdate({ ...report, table2: newTable2 });
  };

  const autoResize = (target: HTMLTextAreaElement) => {
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="no-print flex justify-end gap-3 sticky top-16 z-20 bg-slate-100/90 p-2 rounded-b-xl backdrop-blur border-x border-b border-slate-200 shadow-md">
        <button onClick={handlePrint} className="bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow hover:bg-slate-900 transition-all">PDF出力</button>
        <button onClick={onReset} className="bg-white text-slate-600 px-4 py-1.5 rounded-lg text-xs font-bold border border-slate-300 hover:bg-slate-50 transition-all">新規作成</button>
      </div>

      {/* 第1表 */}
      <div className="bg-white p-6 shadow-sm border border-black max-w-[1100px] mx-auto form-sheet">
        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-1">
          <h2 className="text-lg font-bold">居宅サービス計画書（１）</h2>
          <div className="text-[9pt] font-bold">作成年月日: {report.date}</div>
        </div>
        <div className="grid grid-cols-12 border-t border-l border-black">
          <div className="col-span-2 bg-slate-50 border-r border-b border-black p-2 text-[8pt] font-bold flex items-center justify-center">利用者名</div>
          <div className="col-span-4 border-r border-b border-black p-2 text-md font-bold flex items-center">{report.userName} 様</div>
          <div className="col-span-2 bg-slate-50 border-r border-b border-black p-2 text-[8pt] font-bold flex items-center justify-center">作成者</div>
          <div className="col-span-4 border-r border-b border-black p-2 text-[9pt] flex items-center italic text-slate-400">AI Care Assistant</div>

          <div className="col-span-12 bg-slate-50 border-r border-b border-black p-2 text-[8pt] font-bold">利用者及び家族の生活に対する意欲・意向</div>
          <div className="col-span-12 border-r border-b border-black p-0 min-h-[100px]">
            <textarea 
              className="w-full p-4 text-[9pt] min-h-[100px] outline-none focus:bg-indigo-50/30 no-print resize-none overflow-hidden"
              value={report.table1.userWill}
              onChange={(e) => handleTable1Update('userWill', e.target.value)}
              onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
            />
            <div className="print-only p-4 text-[9pt] whitespace-pre-wrap leading-relaxed">{report.table1.userWill}</div>
          </div>

          <div className="col-span-12 bg-slate-50 border-r border-b border-black p-2 text-[8pt] font-bold">総合的な援助の方針</div>
          <div className="col-span-12 border-r border-b border-black p-0 min-h-[150px]">
            <textarea 
              className="w-full p-4 text-[9pt] min-h-[150px] outline-none focus:bg-indigo-50/30 no-print resize-none overflow-hidden"
              value={report.table1.supportPolicy}
              onChange={(e) => handleTable1Update('supportPolicy', e.target.value)}
              onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
            />
            <div className="print-only p-4 text-[9pt] whitespace-pre-wrap leading-relaxed">{report.table1.supportPolicy}</div>
          </div>
        </div>
      </div>

      {/* 第2表 */}
      <div className="bg-white p-6 shadow-sm border border-black max-w-[1100px] mx-auto form-sheet page-break">
        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-1">
          <h2 className="text-lg font-bold">居宅サービス計画書（２）</h2>
          <div className="text-[9pt] font-bold">{report.userName} 様</div>
        </div>
        
        <table className="w-full border-collapse border border-black text-[8pt]">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-black p-2 w-[25%] font-bold">生活全般の解決すべき課題(ニーズ)</th>
              <th className="border border-black p-2 w-[15%] font-bold">長期目標</th>
              <th className="border border-black p-2 w-[15%] font-bold">短期目標</th>
              <th className="border border-black p-2 w-[35%] font-bold">サービス内容</th>
              <th className="border border-black p-2 w-[10%] font-bold">担当・頻度</th>
            </tr>
          </thead>
          <tbody>
            {report.table2.map((item, idx) => (
              <tr key={idx} className="border-b border-black">
                <td className="border border-black p-0 align-top">
                  <div className="bg-slate-50 p-1 text-[7pt] font-bold border-b border-black no-print">【課題{idx + 1}】</div>
                  <textarea 
                    className="w-full p-2 text-[8pt] outline-none min-h-[80px] resize-none no-print overflow-hidden"
                    value={item.needs}
                    onChange={(e) => handleTable2Update(idx, 'needs', e.target.value)}
                    onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
                  />
                  <div className="print-only p-2 whitespace-pre-wrap">{item.needs}</div>
                </td>
                <td className="border border-black p-0 align-top">
                  <textarea 
                    className="w-full p-2 text-[8pt] outline-none min-h-[80px] resize-none no-print overflow-hidden"
                    value={item.longTermGoal}
                    onChange={(e) => handleTable2Update(idx, 'longTermGoal', e.target.value)}
                    onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
                  />
                  <div className="print-only p-2 whitespace-pre-wrap">{item.longTermGoal}</div>
                </td>
                <td className="border border-black p-0 align-top">
                  <textarea 
                    className="w-full p-2 text-[8pt] outline-none min-h-[80px] resize-none no-print overflow-hidden"
                    value={item.shortTermGoal}
                    onChange={(e) => handleTable2Update(idx, 'shortTermGoal', e.target.value)}
                    onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
                  />
                  <div className="print-only p-2 whitespace-pre-wrap">{item.shortTermGoal}</div>
                </td>
                <td className="border border-black p-0 align-top">
                  <table className="w-full border-collapse">
                    <tbody>
                      {item.services.map((svc, sidx) => (
                        <tr key={sidx} className={sidx !== 0 ? 'border-t border-black' : ''}>
                          <td className="p-0">
                            <textarea 
                              className="w-full p-2 text-[8pt] outline-none min-h-[40px] resize-none no-print overflow-hidden"
                              value={svc.content}
                              onChange={(e) => handleServiceUpdate(idx, sidx, 'content', e.target.value)}
                              onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
                            />
                            <div className="print-only p-2 text-[8pt] leading-snug">{svc.content}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td className="border border-black p-0 align-top">
                  <table className="w-full border-collapse h-full">
                    <tbody>
                      {item.services.map((svc, sidx) => (
                        <tr key={sidx} className={sidx !== 0 ? 'border-t border-black' : ''}>
                          <td className="p-0">
                            <textarea 
                              className="w-full p-2 text-[7pt] text-center italic text-slate-500 outline-none min-h-[40px] resize-none no-print overflow-hidden"
                              value={svc.provider}
                              onChange={(e) => handleServiceUpdate(idx, sidx, 'provider', e.target.value)}
                              onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
                            />
                            <div className="print-only p-2 text-[7pt] text-center italic">{svc.provider}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
