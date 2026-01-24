import React, { useState } from 'react';
import { ConferenceReportCard } from '../components/ConferenceReportCard';
import { ConferenceReport } from '../types';

export const MeetingPage: React.FC = () => {
    const [report, setReport] = useState<ConferenceReport>({
        id: crypto.randomUUID(),
        userName: '',
        createdBy: '',
        holdingDate: new Date().toLocaleDateString('ja-JP'),
        participants: [{ role: '', name: '' }, { role: '', name: '' }, { role: '', name: '' }],
        discussionItems: ['', '', ''],
        discussionDetails: ['', '', ''],
        conclusion: '',
        remainingIssues: ''
    });

    const handleUpdate = (updated: ConferenceReport) => {
        setReport(updated);
    };

    const handleReset = () => {
        setReport({
            id: crypto.randomUUID(),
            userName: '',
            createdBy: '',
            holdingDate: new Date().toLocaleDateString('ja-JP'),
            participants: [{ role: '', name: '' }, { role: '', name: '' }, { role: '', name: '' }],
            discussionItems: ['', '', ''],
            discussionDetails: ['', '', ''],
            conclusion: '',
            remainingIssues: ''
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-slate-800">担当者会議録作成</h1>
                <p className="text-slate-500 mt-2">サービス担当者会議の記録を作成・編集します</p>
            </div>
            <ConferenceReportCard report={report} onUpdate={handleUpdate} onReset={handleReset} />
        </div>
    );
};
