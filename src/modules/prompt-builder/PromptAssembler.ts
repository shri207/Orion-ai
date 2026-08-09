import { 
  IPromptAssembler, 
  ISystemPromptBuilder, 
  IUserPromptBuilder, 
  IContextInjector, 
  ICurriculumInjector, 
  ICandidateInjector, 
  IPromptValidator 
} from './PromptBuilderInterfaces';
import { 
  IPromptBuilderParams, 
  IPromptAssemblyResult, 
  IPromptMessage, 
  ITokenEstimation 
} from './PromptBuilderTypes';
import { ITokenEstimator } from '../conversation-context-manager/ConversationContextInterfaces';

export class PromptAssembler implements IPromptAssembler {
  constructor(
    private readonly systemBuilder: ISystemPromptBuilder,
    private readonly userBuilder: IUserPromptBuilder,
    private readonly contextInjector: IContextInjector,
    private readonly curriculumInjector: ICurriculumInjector,
    private readonly candidateInjector: ICandidateInjector,
    private readonly validator: IPromptValidator,
    private readonly tokenEstimator?: ITokenEstimator
  ) {}

  public assemble(params: IPromptBuilderParams): IPromptAssemblyResult {
    const systemPromptBase = this.systemBuilder.build(params.systemParams);
    
    let injectedSystem = systemPromptBase;
    
    if (params.curriculumData) {
      injectedSystem += '\n\n# Curriculum Info\n' + this.curriculumInjector.inject(params.curriculumData);
    }
    
    if (params.candidateInfo) {
      injectedSystem += '\n\n# Candidate Info\n' + this.candidateInjector.inject(params.candidateInfo);
    }

    let userPromptContent = this.userBuilder.build(params.userParams);
    
    if (params.conversationContext) {
       userPromptContent += '\n\n# Interview Context\n' + this.contextInjector.inject(params.conversationContext);
    }

    const messages: IPromptMessage[] = [
      { role: 'system', content: injectedSystem }
    ];

    if (params.conversationContext?.recentConversation) {
      messages.push(...params.conversationContext.recentConversation);
    }

    messages.push({ role: 'user', content: userPromptContent });

    let estimatedInputTokens = 0;
    if (this.tokenEstimator) {
      for (const msg of messages) {
         estimatedInputTokens += this.tokenEstimator.estimateTokens(msg.content);
         estimatedInputTokens += 4;
      }
    } else {
       const allText = messages.map(m => m.content).join(' ');
       estimatedInputTokens = Math.ceil(allText.length / 4);
    }

    const estimatedOutputTokens = 1024;
    const totalContextSize = estimatedInputTokens + estimatedOutputTokens;
    const remainingTokenBudget = params.maxTokens ? params.maxTokens - totalContextSize : 4000;

    const tokenEstimation: ITokenEstimation = {
      estimatedInputTokens,
      estimatedOutputTokens,
      totalContextSize,
      remainingTokenBudget
    };

    const validation = this.validator.validate(messages, params.maxTokens, totalContextSize);

    return {
      messages,
      validation,
      tokenEstimation
    };
  }
}
