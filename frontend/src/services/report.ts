import api from './api';

export interface ScoreBreakdown {
  communication: number;
  technicalDepth: number;
  confidence: number;
  problemSolving: number;
  overall: number;
}

export interface TopicScore {
  topic: string;
  score: number;
  /** Optional mastery label derived from score */
  mastery?: 'Expert' | 'Proficient' | 'Developing' | 'Needs Work';
}

export interface ConversationEntry {
  index: number;
  topic: string;
  question: string;
  answer: string;
  score: number;
  analysis?: {
    technicalAccuracy?: number;
    conceptsDetected?: string[];
    knowledgeGaps?: string[];
    answerSummary?: string;
  };
}

export interface ReportData {
  reportId: string;
  candidateName: string;
  curriculum: string;
  date: string;
  scores: ScoreBreakdown;
  topicScores: TopicScore[];
  strengths: string[];
  improvements: string[];
  recommendedTopics: string[];
  /** Full Q&A conversation log with per-question scores and analysis */
  conversation?: ConversationEntry[];
  hiringRecommendation: string;
  /** 0–1 confidence from the LLM hiring engine (null if engine wasn't run) */
  hiringConfidence?: number | null;
  hiringStrengths?: string[];
  hiringWeaknesses?: string[];
  hiringReasoning?: string[];
  aiSynthesis: string;
  interviewFlow: string[];
}

export interface LeaderboardEntry {
  rank: number;
  reportId: string;
  candidateName: string;
  jobRole: string;
  overallScore: number;
  generatedAt: string;
  /** Hiring verdict from the HiringRecommendationEngine (e.g. 'Strong Hire') */
  hiringRecommendation?: string;
}

export async function getReport(reportId: string): Promise<ReportData> {
  const res = await api.get<ReportData>(`/report/${reportId}`);
  return res.data;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await api.get<{ leaderboard: LeaderboardEntry[] }>('/report/leaderboard');
  return res.data.leaderboard;
}

export function getPdfUrl(reportId: string): string {
  return `/api/report/${reportId}/pdf`;
}
