import React, { useState } from 'react';
import { CarePlanCard } from '../components/CarePlanCard';
import { CarePlanReport } from '../types';

export const CarePlanPage: React.FC = () => {
    const [report, setReport] = useState<CarePlanReport>({
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString('ja-JP'),
        userName: '',
        table1: { userWill: '', supportPolicy: '' },
        table2: [
            { needs: '', longTermGoal: '', shortTermGoal: '', services: [{ content: '', provider: '' }] },
            { needs: '', longTermGoal: '', shortTermGoal: '', services: [{ content: '', provider: '' }] },
            { needs: '', longTermGoal: '', shortTermGoal: '', services: [{ content: '', provider: '' }] }
        ]
    });

    const handleUpdate = (updated: CarePlanReport) => {
        setReport(updated);
    };

    const handleReset = () => {
        setReport({
            id: crypto.randomUUID(),
            date: new Date().toLocaleDateString('ja-JP'),
            userName: '',
            table1: { userWill: '', supportPolicy: '' },
            table2: [
                { needs: '', longTermGoal: '', shortTermGoal: '', services: [{ content: '', provider: '' }] },
                { needs: '', longTermGoal: '', shortTermGoal: '', services: [{ content: '', provider: '' }] },
                { needs: '', longTermGoal: '', shortTermGoal: '', services: [{ content: '', provider: '' }] }
            ]
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-slate-800">居宅サービス計画書作成</h1>
                <p className="text-slate-500 mt-2">第1表および第2表の作成・編集を行います</p>
            </div>
            <CarePlanCard report={report} onUpdate={handleUpdate} onReset={handleReset} />
        </div>
    );
};
