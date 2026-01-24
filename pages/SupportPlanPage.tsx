import React, { useState } from 'react';
import { CarePlanCard } from '../components/CarePlanCard';
import { CarePlanReport } from '../types';

export const SupportPlanPage: React.FC = () => {
    const [report, setReport] = useState<CarePlanReport>({
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString('ja-JP'),
        userName: '',
        table1: { userWill: '', supportPolicy: '' },
        table2: [
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
                { needs: '', longTermGoal: '', shortTermGoal: '', services: [{ content: '', provider: '' }] }
            ]
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-slate-800">介護予防サービス・支援計画書</h1>
                <p className="text-slate-500 mt-2">要支援利用者向けの計画書を作成します</p>
            </div>
            <div className="relative">
                {/* Note: CarePlanCard uses '居宅サービス計画書' title hardcoded. 
                     We might want to customize it later for Support Plan. */}
                <CarePlanCard report={report} onUpdate={handleUpdate} onReset={handleReset} />
            </div>
        </div>
    );
};
