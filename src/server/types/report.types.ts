export interface IReportDetails {
  reportId: string;
  candidateInfo: {
    name: string;
    role: string;
  };
  metadata: {
    interviewDate: string;
    difficulty: string;
    type: string;
  };
  overallScore: number;
  sectionScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  improvementPlan: any;
  generatedAt: string;
}

export interface IInterviewHistoryItem {
  reportId: string;
  interviewDate: string;
  role: string;
  difficulty: string;
  interviewType: string;
  overallScore: number;
}

export interface IPaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  fromDate?: string;
  toDate?: string;
}

export interface IHistoryResponse {
  data: IInterviewHistoryItem[];
  total: number;
  page: number;
  limit: number;
}
