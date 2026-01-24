
import React, { useState, useRef, useEffect } from 'react';
import { AppStatus } from '../types';

interface RecorderProps {
  onRecordingComplete: (base64Audio: string, mimeType: string) => void;
  status: AppStatus;
}

export const Recorder: React.FC<RecorderProps> = ({ onRecordingComplete, status }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          onRecordingComplete(base64Audio, 'audio/webm');
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Recording error:", err);
      alert("マイクの使用が許可されていないか、利用できません。");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setTimer(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
      <h2 className="text-lg font-semibold text-slate-700 mb-6">モニタリング音声録音</h2>
      
      <div className="flex flex-col items-center gap-6">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-red-50 scale-110 shadow-inner' : 'bg-indigo-50'}`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-indigo-600'}`}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isRecording ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H10a1 1 0 01-1-1v-4z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              )}
            </svg>
          </div>
        </div>

        <div className="text-3xl font-mono font-bold text-slate-800">
          {formatTime(timer)}
        </div>

        <div className="flex gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={status === AppStatus.PROCESSING}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-full font-bold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-100"
            >
              録音を開始
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-colors flex items-center gap-2 shadow-lg shadow-red-100"
            >
              録音を停止
            </button>
          )}
        </div>

        <p className="text-sm text-slate-500 max-w-xs">
          訪問時の会話を録音し、自動で支援経過のドラフトを作成します。
        </p>
      </div>
    </div>
  );
};
