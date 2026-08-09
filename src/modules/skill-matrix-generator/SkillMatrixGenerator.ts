import fs from 'fs/promises';
import path from 'path';
import { ISkillMatrixGenerator } from './SkillMatrixGeneratorInterfaces';
import { ISkillMatrixGeneratorParams, ISkillMatrixResult } from './SkillMatrixGeneratorTypes';
import { SkillMatrixGeneratorValidator } from './SkillMatrixGeneratorValidator';
import { ILLMClient, ILLMMessage } from '../../services/llm/LLMInterfaces';
import { logger } from '../../utils/logger';

export class SkillMatrixGenerator implements ISkillMatrixGenerator {
  constructor(private readonly llmClient: ILLMClient) {}

  public async generateMatrix(params: ISkillMatrixGeneratorParams): Promise<ISkillMatrixResult> {
    logger.info('Starting skill matrix generation');
    const startTime = Date.now();

    const promptTemplate = await this.loadPromptTemplate();
    const systemPrompt = this.buildSystemPrompt(promptTemplate, params);

    const messages: ILLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate the skill matrix based on the session data and return strictly valid JSON.' }
    ];

    const maxValidationRetries = 2;
    let validationAttempt = 0;

    while (validationAttempt <= maxValidationRetries) {
      try {
        const response = await this.llmClient.generateCompletion(messages, {
          responseFormat: 'json_object',
          temperature: 0.1
        });

        const rawJson = this.parseJsonFromResponse(response.content);
        const validResult = SkillMatrixGeneratorValidator.validate(rawJson);
        
        validResult.metadata.processing_time_ms = Date.now() - startTime;
        validResult.metadata.model = response.model;

        logger.info('Skill matrix generation completed successfully');
        return validResult;
      } catch (error: any) {
        validationAttempt++;
        logger.warn({ error: error.message, attempt: validationAttempt }, 'Skill matrix validation failed, retrying');
        if (validationAttempt > maxValidationRetries) {
          logger.error('Max validation retries reached for Skill Matrix Generator');
          throw new Error(`Failed to generate valid skill matrix after ${maxValidationRetries} retries: ${error.message}`);
        }
      }
    }

    throw new Error('Unexpected exit from validation retry loop');
  }

  private async loadPromptTemplate(): Promise<string> {
    const promptPath = path.resolve(process.cwd(), 'src/prompts/skill-matrix-generator.md');
    try {
      return await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
      logger.error({ err: error }, 'Prompt template not found, using fallback');
      return `Evaluate candidate competency and return JSON.`;
    }
  }

  private buildSystemPrompt(template: string, params: ISkillMatrixGeneratorParams): string {
    const safeStringify = (obj: any) => obj ? JSON.stringify(obj, null, 2) : 'Not provided';

    return template
      .replace('{{SESSION_DATA}}', safeStringify(params.sessionData))
      .replace('{{PER_QUESTION_ANALYSIS}}', safeStringify(params.perQuestionAnalysis))
      .replace('{{RUBRIC_ENGINE_OUTPUT}}', safeStringify(params.rubricEngineOutput))
      .replace('{{TOPIC_METADATA}}', safeStringify(params.topicMetadata));
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
