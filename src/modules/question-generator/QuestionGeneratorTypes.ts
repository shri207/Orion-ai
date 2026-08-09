import { InterviewDifficulty } from '../candidate/CandidateTypes';
import { ITopic } from '../curriculum/CurriculumTypes';
import { ImmutableCandidateProfile } from '../candidate/CandidateTypes';

export enum InterviewType {
  TECHNICAL = 'TECHNICAL',
  HR = 'HR',
  BEHAVIORAL = 'BEHAVIORAL',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
  CODING = 'CODING',
  DATABASE = 'DATABASE',
  OOP = 'OOP',
  NETWORKING = 'NETWORKING',
  OPERATING_SYSTEMS = 'OPERATING_SYSTEMS',
  CUSTOM = 'CUSTOM',
}

export interface IQuestionGeneratorParams {
  topic: ITopic;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  interviewRole: string;
  candidateProfile?: ImmutableCandidateProfile;
  previousQuestions: string[];
  additionalContext?: string;
}

export interface IGeneratedQuestion {
  question: string;
  expectedAnswerSummary: string;
  evaluationCriteria: string[];
  difficulty: InterviewDifficulty;
  topic: string; 
  estimatedAnswerTime: number; 
  followUpHints: string[];
  metadata: Record<string, any>;
}
