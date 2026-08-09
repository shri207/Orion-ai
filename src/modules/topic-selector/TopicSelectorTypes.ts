import { ITopic } from '../curriculum/CurriculumTypes';
import { InterviewDifficulty, ICandidateProfile } from '../candidate/CandidateTypes';
import { EnvConfig } from '../config-manager/env.schema';

export enum TopicSelectionMode {
  SEQUENTIAL = 'SEQUENTIAL',
  RANDOM = 'RANDOM',
  ADAPTIVE = 'ADAPTIVE',
}

export enum AdaptiveStrategy {
  BALANCED = 'BALANCED',
  WEAKNESS_FIRST = 'WEAKNESS_FIRST',
  BREADTH_FIRST = 'BREADTH_FIRST',
  DEPTH_FIRST = 'DEPTH_FIRST',
  CHALLENGE_MODE = 'CHALLENGE_MODE'
}

export enum PerformanceClassification {
  STRONG = 'STRONG',
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  WEAK = 'WEAK',
  CRITICAL = 'CRITICAL'
}

export interface ITopicPerformance {
  questionsAnswered: number;
  averageScore: number;
  averageConfidence: number;
  technicalAccuracy: number;
  followUpCount: number;
  hintCount: number;
  timeTaken: number;
  completionRate: number;
  lastUpdated: string;
}

export interface ITopicState {
  completedTopics: string[];
  currentTopic: string | null;
  topicHistory: string[];
  remainingTopics: string[];
  performanceRecord?: Record<string, ITopicPerformance>;
}

export interface ITopicSelectionContext {
  candidateProfile: ICandidateProfile | any;
  curriculumTopics: ITopic[];
  topicState: ITopicState;
  interviewPhase: 'START' | 'MIDDLE' | 'END';
  remainingTimeMinutes: number;
  adaptiveStrategy: AdaptiveStrategy;
  currentDifficulty: InterviewDifficulty;
  config: EnvConfig;
}

export interface ITopicSelectorResult {
  selectedTopic: ITopic | null;
  difficulty: InterviewDifficulty;
  reason: string;
  updatedTopicState: ITopicState;
  priorityScore?: number;
  performanceClassification?: PerformanceClassification;
  strategy?: AdaptiveStrategy;
}

export interface ITopicSelectorParams {
  curriculumTopics: ITopic[];
  topicState: ITopicState;
  currentDifficulty: InterviewDifficulty;
  mode: TopicSelectionMode;
  candidateWeakTopics?: string[]; // Legacy property for ADAPTIVE v1
}
