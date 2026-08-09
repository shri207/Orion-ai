import { ISession } from '../session/SessionInterfaces';
import { IRubricEngineResult } from '../rubric-engine/RubricEngineTypes';
import { ISkillMatrixResult } from '../skill-matrix-generator/SkillMatrixGeneratorTypes';
import { ICandidateAnalyzerResult } from '../candidate-analyzer/CandidateAnalyzerTypes';
import { ITechnicalAccuracyResult } from '../technical-accuracy-checker/TechnicalAccuracyCheckerTypes';

export type HiringRecommendationDecision = 
  | 'Strong Hire' 
  | 'Hire' 
  | 'Lean Hire' 
  | 'Maybe' 
  | 'Lean No Hire' 
  | 'No Hire' 
  | 'Strong No Hire';

export interface IHiringDecisionFactors {
  technical: number;
  communication: number;
  problemSolving: number;
  accuracy: number;
  coverage: number;
}

export interface IRoleReadiness {
  currentLevel: string;
  estimatedExperience: string;
  readyForProduction: boolean;
}

export interface IHiringLearningRecommendations {
  learningPriorities: string[];
  interviewSummary: string;
}

export interface IHiringRecommendationMetadata {
  processing_time_ms: number;
  model: string;
}

export interface IHiringRecommendationResult {
  recommendation: HiringRecommendationDecision;
  confidence: number;
  overallScore: number;
  decisionFactors: IHiringDecisionFactors;
  strengths: string[];
  weaknesses: string[];
  criticalGaps: string[];
  reasoning: string[];
  roleReadiness: IRoleReadiness;
  recommendations: IHiringLearningRecommendations;
  metadata: IHiringRecommendationMetadata;
}

export interface IHiringDecisionConfig {
  minimumHireScore: number;
  minimumTechnicalScore: number;
  criticalGapPenalty: number;
  severeFactualErrorPenalty: number;
}

export interface IHiringRecommendationEngineParams {
  interviewType: string;
  sessionSummary: ISession;
  rubricEngineOutput: IRubricEngineResult;
  skillMatrix: ISkillMatrixResult;
  perQuestionEvaluations: any[];
  technicalAccuracyReports: ITechnicalAccuracyResult[];
  candidateAnalysisResults: ICandidateAnalyzerResult[];
}
