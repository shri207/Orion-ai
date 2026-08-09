import { InterviewDifficulty } from '../candidate/CandidateTypes';
import { ITopic } from '../curriculum/CurriculumTypes';
import { ImmutableCandidateProfile } from '../candidate/CandidateTypes';
import { InterviewType } from '../question-generator/QuestionGeneratorTypes';

export enum FollowUpStrategy {
  CLARIFICATION = 'CLARIFICATION',
  DEPTH_EXPLORATION = 'DEPTH_EXPLORATION',
  EDGE_CASES = 'EDGE_CASES',
  TRADE_OFFS = 'TRADE_OFFS',
  PRACTICAL_SCENARIO = 'PRACTICAL_SCENARIO',
  OPTIMIZATION = 'OPTIMIZATION',
  UNKNOWN = 'UNKNOWN',
}

export interface IFollowUpGeneratorParams {
  originalQuestion: string;
  candidateAnswer: string;
  topic: ITopic;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  previousFollowUpQuestions: string[];
  candidateProfile?: ImmutableCandidateProfile;
  additionalContext?: string;
}

export interface IGeneratedFollowUp {
  followUpQuestion: string;
  reasonForFollowUp: string;
  detectedKnowledgeGap: string;
  focusArea: string;
  difficulty: InterviewDifficulty;
  expectedAnswerSummary: string;
  evaluationCriteria: string[];
  metadata: Record<string, any>;
}
