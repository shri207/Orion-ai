import fs from 'fs/promises';
import path from 'path';
import { ICommunicationAnalyzer } from './CommunicationAnalyzerInterfaces';
import { ICommunicationAnalyzerParams, ICommunicationAnalyzerResult } from './CommunicationAnalyzerTypes';
import { CommunicationAnalyzerValidator } from './CommunicationAnalyzerValidator';
import { ILLMClient, ILLMMessage } from '../../services/llm/LLMInterfaces';
import { logger } from '../../utils/logger';

export class CommunicationAnalyzer implements ICommunicationAnalyzer {
  constructor(private readonly llmClient: ILLMClient) {}

  public async analyzeCommunication(params: ICommunicationAnalyzerParams): Promise<ICommunicationAnalyzerResult> {
    logger.info('Starting communication analysis');
    const startTime = Date.now();

    if (!params.candidateAnswer || params.candidateAnswer.trim().length < 2) {
      return this.buildEmptyResult(Date.now() - startTime, 'No model');
    }

    const promptTemplate = await this.loadPromptTemplate();
    const systemPrompt = this.buildSystemPrompt(promptTemplate, params);

    const messages: ILLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Evaluate the communication quality of the candidate\'s answer and return strictly valid JSON.' }
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
        const validResult = CommunicationAnalyzerValidator.validate(rawJson);
        
        validResult.metadata.processing_time_ms = Date.now() - startTime;
        validResult.metadata.model = response.model;

        logger.info('Communication analysis completed successfully');
        return validResult;
      } catch (error: any) {
        validationAttempt++;
        logger.warn({ error: error.message, attempt: validationAttempt }, 'Communication analysis validation failed, retrying');
        if (validationAttempt > maxValidationRetries) {
          logger.error('Max validation retries reached for Communication Analyzer');
          throw new Error(`Failed to generate valid communication analysis after ${maxValidationRetries} retries: ${error.message}`);
        }
      }
    }

    throw new Error('Unexpected exit from validation retry loop');
  }

  private buildEmptyResult(processingTime: number, model: string): ICommunicationAnalyzerResult {
    return {
      overall_score: 0,
      grammar: { score: 0, issues: ['No answer provided'] },
      clarity: { score: 0, issues: ['No answer provided'] },
      structure: { score: 0, feedback: 'No structure to evaluate.' },
      logical_flow: { score: 0, feedback: 'No flow to evaluate.' },
      professionalism: { score: 0, feedback: 'Cannot evaluate professionalism of empty answer.' },
      confidence_in_communication: { score: 0, indicators: ['Did not answer'] },
      filler_words: [],
      repetition: [],
      ambiguous_statements: [],
      strengths: [],
      improvements: ['Candidate must provide a response.'],
      communication_feedback: 'No answer provided to evaluate communication.',
      metadata: {
        processing_time_ms: processingTime,
        model
      }
    };
  }

  private async loadPromptTemplate(): Promise<string> {
    const promptPath = path.resolve(process.cwd(), 'src/prompts/communication-analyzer.md');
    try {
      return await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
      logger.error({ err: error }, 'Prompt template not found, using fallback');
      return `Evaluate communication quality and return JSON.`;
    }
  }

  private buildSystemPrompt(template: string, params: ICommunicationAnalyzerParams): string {
    const analyzerContext = params.candidateAnalyzerOutput
      ? JSON.stringify(params.candidateAnalyzerOutput, null, 2)
      : 'No prior analyzer output provided.';

    return template
      .replace('{{INTERVIEW_QUESTION}}', params.interviewQuestion)
      .replace('{{CANDIDATE_ANSWER}}', params.candidateAnswer)
      .replace('{{CANDIDATE_ANALYZER_OUTPUT}}', analyzerContext);
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
