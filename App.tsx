import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MonitoringPage } from './pages/MonitoringPage';
import { MeetingPage } from './pages/MeetingPage';
import { CarePlanPage } from './pages/CarePlanPage';
import { SupportPlanPage } from './pages/SupportPlanPage';
import { AdmissionPage } from './pages/AdmissionPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MonitoringPage />} />
          <Route path="/meeting" element={<MeetingPage />} />
          <Route path="/care-plan" element={<CarePlanPage />} />
          <Route path="/support-plan" element={<SupportPlanPage />} />
          <Route path="/admission" element={<AdmissionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;