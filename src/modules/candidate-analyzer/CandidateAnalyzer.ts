import fs from 'fs/promises';
import path from 'path';
import { ICandidateAnalyzer } from './CandidateAnalyzerInterfaces';
import { ICandidateAnalyzerParams, ICandidateAnalyzerResult } from './CandidateAnalyzerTypes';
import { CandidateAnalyzerValidator } from './CandidateAnalyzerValidator';
import { ILLMClient, ILLMMessage } from '../../services/llm/LLMInterfaces';
import { logger } from '../../utils/logger';

export class CandidateAnalyzer implements ICandidateAnalyzer {
  constructor(private readonly llmClient: ILLMClient) {}

  public async analyzeAnswer(params: ICandidateAnalyzerParams): Promise<ICandidateAnalyzerResult> {
    logger.info('Starting candidate answer analysis');
    const startTime = Date.now();

    if (!params.candidateAnswer || params.candidateAnswer.trim().length < 2) {
      return this.buildEmptyResult(Date.now() - startTime, 'No model');
    }

    const promptTemplate = await this.loadPromptTemplate();
    const systemPrompt = this.buildSystemPrompt(promptTemplate, params);

    const messages: ILLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Analyze the candidate\'s answer and return only valid JSON.' }
    ];

    const maxValidationRetries = 2;
    let validationAttempt = 0;

    while (validationAttempt <= maxValidationRetries) {
      try {
        const response = await this.llmClient.generateCompletion(messages, {
          responseFormat: 'json_object',
          temperature: 0.2
        });

        const rawJson = this.parseJsonFromResponse(response.content);
        const validResult = CandidateAnalyzerValidator.validate(rawJson);
        
        validResult.metadata.processing_time_ms = Date.now() - startTime;
        validResult.metadata.model = response.model;

        logger.info('Answer analysis completed successfully');
        return validResult;
      } catch (error: any) {
        validationAttempt++;
        logger.warn({ error: error.message, attempt: validationAttempt }, 'Analysis validation failed, retrying');
        if (validationAttempt > maxValidationRetries) {
          logger.error('Max validation retries reached for analyzer');
          throw new Error(`Failed to generate valid analysis after ${maxValidationRetries} retries: ${error.message}`);
        }
      }
    }

    throw new Error('Unexpected exit from validation retry loop');
  }

  private buildEmptyResult(processingTime: number, model: string): ICandidateAnalyzerResult {
    return {
      concepts_detected: [],
      missing_concepts: [],
      misconceptions: [],
      knowledge_gaps: ['Empty or extremely short answer provided.'],
      reasoning_style: 'None',
      guessing_signals: [],
      uncertainty_signals: [],
      answer_summary: 'The candidate did not provide a meaningful answer.',
      analysis_notes: 'Answer was too short to analyze.',
      metadata: {
        processing_time_ms: processingTime,
        model
      }
    };
  }

  private async loadPromptTemplate(): Promise<string> {
    const promptPath = path.resolve(process.cwd(), 'src/prompts/candidate-analyzer.md');
    try {
      return await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
      logger.error({ err: error }, 'Prompt template not found, using fallback');
      return `Analyze the candidate answer and return JSON.`;
    }
  }

  private buildSystemPrompt(template: string, params: ICandidateAnalyzerParams): string {
    const topicContext = typeof params.topicMetadata === 'string' 
      ? params.topicMetadata 
      : JSON.stringify(params.topicMetadata);

    const expectedConceptsContext = params.expectedConcepts && params.expectedConcepts.length > 0
      ? params.expectedConcepts.join(', ')
      : 'None provided';

    return template
      .replace('{{INTERVIEW_QUESTION}}', params.interviewQuestion)
      .replace('{{CANDIDATE_ANSWER}}', params.candidateAnswer)
      .replace('{{TOPIC_METADATA}}', topicContext)
      .replace('{{DIFFICULTY}}', params.difficulty)
      .replace('{{EXPECTED_CONCEPTS}}', expectedConceptsContext);
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
