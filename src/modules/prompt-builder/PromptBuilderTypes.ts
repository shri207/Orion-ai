import { IOpenRouterMessage } from '../openrouter-client/OpenRouterClientTypes';
import { IAssembledContext } from '../conversation-context-manager/ConversationContextTypes';

export interface IPromptMessage extends IOpenRouterMessage {}

export interface IPromptTemplateData {
  [key: string]: any;
}

export interface IPromptValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ITokenEstimation {
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  totalContextSize: number;
  remainingTokenBudget: number;
}

export interface IPromptAssemblyResult {
  messages: IPromptMessage[];
  validation: IPromptValidationResult;
  tokenEstimation: ITokenEstimation;
}

export interface ISystemPromptParams {
  role?: string;
  objectives?: string[];
  rules?: string[];
  responseFormat?: string;
  difficulty?: string;
  safetyInstructions?: string[];
}

export interface IUserPromptParams {
  interviewState?: string;
  questionObjective?: string;
  candidateLatestAnswer?: string;
  followUpRequirements?: string;
  topicInstructions?: string;
  difficultyLevel?: string;
  timeConstraints?: string;
}

export interface IPromptBuilderParams {
  systemParams: ISystemPromptParams;
  userParams: IUserPromptParams;
  conversationContext?: IAssembledContext;
  curriculumData?: any;
  candidateInfo?: any;
  maxTokens?: number;
}
