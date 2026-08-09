export interface IReportCandidateInfo {
  name: string;
  role: string;
  experience: string;
  interviewDate: string;
  durationMinutes: number;
}

export interface IReportScores {
  technical: number;
  communication: number;
  problemSolving: number;
  confidence: number;
  overall: number;
}

export interface IReportTopicBreakdown {
  topic: string;
  questionsAsked: number;
  score: number;
  accuracy: number;
  notes: string;
}

export interface IReportEvidence {
  description: string;
  evidence: string;
}

export interface IReportSummary {
  text: string;
}

export type HiringRecommendation = 'Strong Hire' | 'Hire' | 'Borderline' | 'No Hire';

export interface IInterviewReport {
  candidate: IReportCandidateInfo;
  scores: IReportScores;
  topicBreakdown: IReportTopicBreakdown[];
  strengths: IReportEvidence[];
  weaknesses: IReportEvidence[];
  aiSummary: IReportSummary;
  recommendation: HiringRecommendation;
}

export interface IReportGeneratorInput {
  session: any;
  candidateProfile: any;
  rubricScores: any;
  skillMatrix: any;
  questionHistory: any[];
  aiEvaluations: any[];
  communicationMetrics: any;
}
