import fs from 'fs/promises';
import path from 'path';
import { ICandidateProfileAnalyzer, ICandidateProfileAnalyzerParams } from './ICandidateProfileAnalyzer';
import { ICandidateAnalysisResult } from './types/CandidateAnalysisResult';
import { CandidateAnalysisParser } from './CandidateAnalysisParser';
import { ILLMClient, ILLMMessage } from '../../services/llm/LLMInterfaces';
import { logger } from '../../utils/logger';

export class CandidateProfileAnalyzer implements ICandidateProfileAnalyzer {
  constructor(private readonly llmClient: ILLMClient) {}

  public async analyzeProfile(params: ICandidateProfileAnalyzerParams): Promise<ICandidateAnalysisResult> {
    logger.info('Starting candidate profile analysis');

    if (!params.profileText || params.profileText.trim().length < 10) {
      throw new Error('CandidateProfileAnalyzer: Profile text is too short or empty.');
    }

    const promptTemplate = await this.loadPromptTemplate();
    const systemPrompt = this.buildSystemPrompt(promptTemplate, params.profileText);

    const messages: ILLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Analyze the candidate profile and return strictly structured JSON.' }
    ];

    const maxRetries = 2;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        const response = await this.llmClient.generateCompletion(messages, {
          responseFormat: 'json_object',
          temperature: 0.1 // Lower temperature for analytical deterministic output
        });

        const validResult = CandidateAnalysisParser.parse(response.content);
        logger.info('Profile analysis completed successfully');
        return validResult;
      } catch (error: any) {
        attempt++;
        logger.warn({ error: error.message, attempt }, 'Profile analysis validation failed, retrying');
        if (attempt > maxRetries) {
          logger.error('Max validation retries reached for profile analyzer');
          throw new Error(`Failed to generate valid profile analysis after ${maxRetries} retries: ${error.message}`);
        }
      }
    }

    throw new Error('CandidateProfileAnalyzer: Unexpected exit from retry loop');
  }

  private async loadPromptTemplate(): Promise<string> {
    const promptPath = path.resolve(process.cwd(), 'src/modules/candidate-profile-analyzer/prompts/candidate-profile-analyzer.md');
    try {
      return await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
      logger.error({ err: error }, 'Profile analyzer prompt template not found');
      throw new Error('CandidateProfileAnalyzer: Missing prompt template');
    }
  }

  private buildSystemPrompt(template: string, profileText: string): string {
    return template.replace('{{CANDIDATE_PROFILE}}', profileText);
  }
}
