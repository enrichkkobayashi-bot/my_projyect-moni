
export type ReportType = 'monitoring' | 'assessment' | 'care_plan' | 'conference';

export interface MonitoringReport {
  id: string;
  date: string;
  summaryText: string;
  extractedFields: {
    time: string;
    location: string;
    interviewee: string;
    supportContent: string;
    condition: string;
    serviceStatus: string;
    satisfaction: string;
    familyStatus: string;
    intentions: string;
    planValidity: string;
  };
  transcript: string;
  reportType?: 'monitoring' | 'conversation_summary';
}

// Fix: Added ChecklistItem for AssessmentCard.tsx
export interface ChecklistItem {
  question: string;
  answer: string;
}

// Fix: Added BasicInfo helper interface for AssessmentReport
export interface BasicInfo {
  userName?: string;
  gender?: string;
  birthDate?: string;
  age?: string;
  address?: string;
  tel?: string;
  mobile?: string;
  email?: string;
  careLevel?: string;
  certificationDate?: string;
  certificationPeriod?: string;
  adlRank?: string;
  dementiaRank?: string;
  diseaseName?: string;
  onsetDate?: string;
  medication?: string;
  visitFrequency?: string;
  medicalOrg?: string;
  doctorName?: string;
  medicalContact?: string;
  specialNotes?: string;
  lifeHistory?: string;
  currentSituation?: string;
  hobbies?: string;
  dailyRhythm?: string;
  familyMembers?: string;
  genogram?: string;
  houseLayout?: string;
  socialSecurity?: string;
  economicStatus?: string;
}

// Fix: Added AssessmentReport for AssessmentCard.tsx
export interface AssessmentReport {
  id: string;
  category: 'care' | 'support';
  date: string;
  basicInfo: BasicInfo;
  items?: Record<string, string>;
  checklist?: ChecklistItem[];
}

// Fix: Added PreventiveCarePlan for AssessmentCard.tsx
export interface PreventiveCarePlan {
  id: string;
  date: string;
  userName: string;
  goals: string[];
  services: string[];
}

// Fix: Added CarePlanReport for CarePlanCard.tsx
export interface CarePlanReport {
  id: string;
  date: string;
  userName: string;
  table1: {
    userWill: string;
    supportPolicy: string;
  };
  table2: Array<{
    needs: string;
    longTermGoal: string;
    shortTermGoal: string;
    services: Array<{
      content: string;
      provider: string;
    }>;
  }>;
}

// Fix: Added ConferenceReport for ConferenceReportCard.tsx
export interface ConferenceReport {
  id: string;
  userName: string;
  createdBy: string;
  holdingDate: string;
  participants: Array<{ role: string; name: string }>;
  discussionItems: string[];
  discussionDetails: string[];
  conclusion: string;
  remainingIssues: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
