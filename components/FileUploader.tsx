
import React, { useState, useRef } from 'react';
import { AppStatus } from '../types';

interface FileUploaderProps {
  onFileAdd: (fileData: { base64: string, name: string, type: string }) => void;
  onStartAnalysis: () => void;
  pendingFiles: { name: string, type: string }[];
  onRemoveFile: (index: number) => void;
  status: AppStatus;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileAdd, 
  onStartAnalysis, 
  pendingFiles, 
  onRemoveFile,
  status 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      onFileAdd({
        base64: base64Data,
        name: file.name,
        type: file.type
      });
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(handleFile);
    }
    // Reset input to allow adding the same file again if needed
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach(handleFile);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">データの取り込み（複数可）</h2>
        
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center gap-3 cursor-pointer ${
            dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input 
            ref={inputRef}
            type="file" 
            multiple
            accept="audio/*,application/pdf,text/plain" 
            className="hidden" 
            onChange={handleChange}
            disabled={status === AppStatus.PROCESSING}
          />
          
          <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          
          <div className="text-center">
            <p className="text-slate-700 font-medium text-sm">ファイルを追加</p>
            <p className="text-slate-400 text-xs mt-1">音声, PDF, テキストに対応</p>
          </div>
        </div>

        {pendingFiles.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">読み込み済みリスト ({pendingFiles.length}件)</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {pendingFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-1.5 bg-white rounded border border-slate-200 text-indigo-500">
                      {file.type.includes('audio') ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 3.414L15.586 7a2 2 0 01.414.586V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-600 truncate">{file.name}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemoveFile(idx); }}
                    className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={onStartAnalysis}
              disabled={status === AppStatus.PROCESSING}
              className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
            >
              <span>解析を開始する</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <p className="text-[10px] text-slate-400 text-center leading-relaxed">
        ※音声だけでなくPDF等の補助資料も一緒に読み込ませることで、<br />
        より正確なアセスメント結果が得られます。
      </p>
    </div>
  );
};
