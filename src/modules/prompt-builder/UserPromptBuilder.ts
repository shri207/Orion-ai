import { IUserPromptBuilder, IPromptTemplateEngine } from './PromptBuilderInterfaces';
import { IUserPromptParams } from './PromptBuilderTypes';

export class UserPromptBuilder implements IUserPromptBuilder {
  constructor(private readonly templateEngine: IPromptTemplateEngine) {}

  public build(params: IUserPromptParams): string {
    const template = `
Current Interview State: {{interviewState}}
Question Objective: {{questionObjective}}
Candidate Latest Answer: {{candidateLatestAnswer}}
Follow-up Requirements: {{followUpRequirements}}
Topic Instructions: {{topicInstructions}}
Difficulty Level: {{difficultyLevel}}
Time Constraints: {{timeConstraints}}
`.trim();

    return this.templateEngine.render(template, {
      interviewState: params.interviewState || 'N/A',
      questionObjective: params.questionObjective || 'N/A',
      candidateLatestAnswer: params.candidateLatestAnswer || 'N/A',
      followUpRequirements: params.followUpRequirements || 'N/A',
      topicInstructions: params.topicInstructions || 'N/A',
      difficultyLevel: params.difficultyLevel || 'N/A',
      timeConstraints: params.timeConstraints || 'N/A'
    });
  }
}
