import React, { useState } from 'react';
import { AssessmentCard } from '../components/AssessmentCard';
import { AssessmentReport } from '../types';

export const AdmissionPage: React.FC = () => {
    const [report, setReport] = useState<AssessmentReport>({
        id: crypto.randomUUID(),
        category: 'care',
        date: new Date().toLocaleDateString('ja-JP'),
        basicInfo: {},
        items: {}
    });

    const handleUpdate = (updated: AssessmentReport) => {
        setReport(updated);
    };

    const handleReset = () => {
        setReport({
            id: crypto.randomUUID(),
            category: 'care',
            date: new Date().toLocaleDateString('ja-JP'),
            basicInfo: {},
            items: {}
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-slate-800">入院時情報連携シート</h1>
                <p className="text-slate-500 mt-2">基本情報およびアセスメント情報の管理を行います</p>
            </div>
            <AssessmentCard report={report} onUpdate={handleUpdate} onReset={handleReset} />
        </div>
    );
};
