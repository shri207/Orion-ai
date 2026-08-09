import { IInterviewReport, IReportScores } from '../report-generator/types';

export interface IImprovementOverview {
  overallAssessment: string;
  proficiencyLevel: string;
  readinessSummary: string;
}

export interface IPriorityImprovement {
  topic: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  whyItMatters: string;
  expectedImpact: string;
}

export interface ILearningPhase {
  phaseName: string;
  topics: string[];
  learningObjectives: string[];
  practicalExercises: string[];
  miniProjects: string[];
  completionCriteria: string[];
}

export interface IRecommendedResource {
  title: string;
  type: 'Documentation' | 'Article' | 'Course' | 'Book' | 'Practice Platform' | 'Other';
  description: string;
  url?: string;
}

export interface ITopicResources {
  topic: string;
  resources: IRecommendedResource[];
}

export interface IPracticePlan {
  dailyTasks: string[];
  weeklyGoals: string[];
  revisionSchedule: string;
  mockInterviewRecommendations: string;
}

export interface IEstimatedTimeline {
  duration: string;
  estimatedHoursPerWeek: number;
  totalLearningHours: number;
}

export interface IMilestone {
  description: string;
  isKeyMilestone: boolean;
}

export interface ISuccessMetrics {
  topicMastery: string;
  practiceCompletion: string;
  mockInterviewScoreTarget: number;
  confidenceImprovement: string;
  communicationImprovement: string;
}

export interface IImprovementPlan {
  overview: IImprovementOverview;
  priorities: IPriorityImprovement[];
  roadmap: ILearningPhase[];
  resources: ITopicResources[];
  practicePlan: IPracticePlan;
  timeline: IEstimatedTimeline;
  milestones: IMilestone[];
  successMetrics: ISuccessMetrics;
  finalEncouragement: string;
}

export interface IImprovementPlanInput {
  report: IInterviewReport;
  skillMatrix: any;
  rubricScores: IReportScores;
  topicEvaluations: any[];
  candidateProfile: any;
  aiObservations: any;
}
