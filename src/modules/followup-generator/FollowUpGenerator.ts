import fs from 'fs/promises';
import path from 'path';
import { IFollowUpGenerator } from './FollowUpGeneratorInterfaces';
import { IFollowUpGeneratorParams, IGeneratedFollowUp } from './FollowUpGeneratorTypes';
import { FollowUpGeneratorValidator } from './FollowUpGeneratorValidator';
import { ILLMClient, ILLMMessage } from '../../services/llm/LLMInterfaces';
import { logger } from '../../utils/logger';
import { env } from '../../config/env';

export class FollowUpGenerator implements IFollowUpGenerator {
  constructor(private readonly llmClient: ILLMClient) {}

  public async generateFollowUp(params: IFollowUpGeneratorParams): Promise<IGeneratedFollowUp> {
    const { 
      originalQuestion, 
      candidateAnswer, 
      topic, 
      difficulty, 
      interviewType, 
      previousFollowUpQuestions 
    } = params;

    if (previousFollowUpQuestions.length >= env.MAX_FOLLOWUPS_PER_TOPIC) {
      throw new Error(`Maximum follow-up questions (${env.MAX_FOLLOWUPS_PER_TOPIC}) for this topic reached.`);
    }

    logger.info({ topicId: topic.id, difficulty, interviewType }, 'Starting follow-up question generation');

    const promptTemplate = await this.loadPromptTemplate();
    const systemPrompt = this.buildSystemPrompt(promptTemplate, params);

    const messages: ILLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Analyze the answer and generate exactly ONE follow-up question as valid JSON.' }
    ];

    const maxValidationRetries = 2;
    let validationAttempt = 0;

    while (validationAttempt <= maxValidationRetries) {
      try {
        const response = await this.llmClient.generateCompletion(messages, {
          responseFormat: 'json_object'
        });

        const rawJson = this.parseJsonFromResponse(response.content);
        const validFollowUp = FollowUpGeneratorValidator.validate(rawJson, difficulty);
        
        logger.info({ topicId: topic.id }, 'Follow-up question generated successfully');
        return validFollowUp;
      } catch (error: any) {
        validationAttempt++;
        logger.warn({ error: error.message, attempt: validationAttempt }, 'Follow-up validation failed, retrying generation');
        if (validationAttempt > maxValidationRetries) {
          logger.error('Max validation retries reached for follow-up');
          throw new Error(`Failed to generate a valid follow-up question after ${maxValidationRetries} retries: ${error.message}`);
        }
      }
    }

    throw new Error('Unexpected exit from follow-up validation retry loop');
  }

  private async loadPromptTemplate(): Promise<string> {
    const promptPath = path.resolve(process.cwd(), 'src/prompts/followup-generator.md');
    try {
      return await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
      logger.error({ err: error }, 'Prompt template not found, using fallback');
      return `Analyze the candidate's answer to the previous question and generate a follow-up. Return JSON.`;
    }
  }

  private buildSystemPrompt(template: string, params: IFollowUpGeneratorParams): string {
    const candidateContext = params.candidateProfile 
      ? `Experience: ${params.candidateProfile.yearsOfExperience} years. Summary: ${params.candidateProfile.resumeSummary}`
      : 'No candidate context provided.';

    const previousQContext = params.previousFollowUpQuestions.length > 0
      ? `Previously Asked Follow-ups (DO NOT REPEAT):\n${params.previousFollowUpQuestions.map(q => `- ${q}`).join('\n')}`
      : 'No previous follow-ups asked.';

    return template
      .replace('{{INTERVIEW_TYPE}}', params.interviewType)
      .replace('{{TOPIC_NAME}}', params.topic.name)
      .replace('{{TOPIC_DESCRIPTION}}', params.topic.description)
      .replace('{{DIFFICULTY}}', params.difficulty)
      .replace('{{ORIGINAL_QUESTION}}', params.originalQuestion)
      .replace('{{CANDIDATE_ANSWER}}', params.candidateAnswer)
      .replace('{{PREVIOUS_FOLLOW_UPS}}', previousQContext)
      .replace('{{CANDIDATE_CONTEXT}}', candidateContext)
      .replace('{{ADDITIONAL_CONTEXT}}', params.additionalContext || 'None');
  }

  private parseJsonFromResponse(content: string): any {
    try {
      return JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      const bracketMatch = content.match(/(\{[\s\S]*\})/);
      if (bracketMatch && bracketMatch[1]) {
        return JSON.parse(bracketMatch[1]);
      }
      throw new Error('Could not parse JSON from LLM response');
    }
  }
}
