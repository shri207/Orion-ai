import { ISystemPromptBuilder, IPromptTemplateEngine } from './PromptBuilderInterfaces';
import { ISystemPromptParams } from './PromptBuilderTypes';

export class SystemPromptBuilder implements ISystemPromptBuilder {
  constructor(private readonly templateEngine: IPromptTemplateEngine) {}
  
  public build(params: ISystemPromptParams): string {
    const template = `
You are an AI interviewer. Role: {{role}}

# Objectives
{{objectives}}

# Rules
{{rules}}

# Response Format
{{responseFormat}}

# Difficulty Adaptation
{{difficulty}}

# Safety Instructions
{{safetyInstructions}}
`.trim();

    return this.templateEngine.render(template, {
      role: params.role || 'Expert Technical Interviewer',
      objectives: params.objectives?.join('\n- ') || 'Assess candidate skills strictly and fairly.',
      rules: params.rules?.join('\n- ') || 'Ask one question at a time. Do not provide answers.',
      responseFormat: params.responseFormat || 'Return valid JSON matching the schema.',
      difficulty: params.difficulty || 'Adapt to the candidate\'s responses.',
      safetyInstructions: params.safetyInstructions?.join('\n- ') || 'Do not hallucinate. Be respectful.'
    });
  }
}
