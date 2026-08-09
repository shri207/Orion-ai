import { 
  IPromptMessage, 
  IPromptAssemblyResult, 
  IPromptValidationResult,
  ISystemPromptParams,
  IUserPromptParams,
  IPromptBuilderParams,
  IPromptTemplateData
} from './PromptBuilderTypes';
import { IAssembledContext } from '../conversation-context-manager/ConversationContextTypes';

export interface IPromptTemplateEngine {
  render(template: string, data: IPromptTemplateData): string;
}

export interface ISystemPromptBuilder {
  build(params: ISystemPromptParams): string;
}

export interface IUserPromptBuilder {
  build(params: IUserPromptParams): string;
}

export interface IContextInjector {
  inject(context: IAssembledContext): string;
}

export interface ICurriculumInjector {
  inject(curriculum: any): string;
}

export interface ICandidateInjector {
  inject(candidate: any): string;
}

export interface IPromptValidator {
  validate(messages: IPromptMessage[], maxTokens?: number, estimatedTokens?: number): IPromptValidationResult;
}

export interface IPromptAssembler {
  assemble(params: IPromptBuilderParams): IPromptAssemblyResult;
}

export interface IPromptBuilder {
  buildPrompt(params: IPromptBuilderParams): IPromptAssemblyResult;
}
