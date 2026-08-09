import fs from 'fs/promises';
import path from 'path';
import { ITechnicalAccuracyChecker } from './TechnicalAccuracyCheckerInterfaces';
import { ITechnicalAccuracyCheckerParams, ITechnicalAccuracyResult } from './TechnicalAccuracyCheckerTypes';
import { TechnicalAccuracyCheckerValidator } from './TechnicalAccuracyCheckerValidator';
import { ILLMClient, ILLMMessage } from '../../services/llm/LLMInterfaces';
import { logger } from '../../utils/logger';

export class TechnicalAccuracyChecker implements ITechnicalAccuracyChecker {
  constructor(private readonly llmClient: ILLMClient) {}

  public async evaluateAccuracy(params: ITechnicalAccuracyCheckerParams): Promise<ITechnicalAccuracyResult> {
    logger.info('Starting technical accuracy evaluation');
    const startTime = Date.now();

    if (!params.candidateAnswer || params.candidateAnswer.trim().length < 2) {
      return this.buildEmptyResult(Date.now() - startTime, 'No model');
    }

    const promptTemplate = await this.loadPromptTemplate();
    const systemPrompt = this.buildSystemPrompt(promptTemplate, params);

    const messages: ILLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Evaluate the technical accuracy of the candidate\'s answer and return strictly valid JSON.' }
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
        const validResult = TechnicalAccuracyCheckerValidator.validate(rawJson);
        
        validResult.metadata.processing_time_ms = Date.now() - startTime;
        validResult.metadata.model = response.model;

        logger.info('Technical accuracy evaluation completed successfully');
        return validResult;
      } catch (error: any) {
        validationAttempt++;
        logger.warn({ error: error.message, attempt: validationAttempt }, 'Accuracy evaluation validation failed, retrying');
        if (validationAttempt > maxValidationRetries) {
          logger.error('Max validation retries reached for Technical Accuracy Checker');
          throw new Error(`Failed to generate valid technical accuracy evaluation after ${maxValidationRetries} retries: ${error.message}`);
        }
      }
    }

    throw new Error('Unexpected exit from validation retry loop');
  }

  private buildEmptyResult(processingTime: number, model: string): ITechnicalAccuracyResult {
    return {
      overall_score: 0,
      technical_accuracy: 0,
      concept_scores: [],
      correct_concepts: [],
      partially_correct_concepts: [],
      incorrect_concepts: [],
      missing_concepts: ['All expected concepts are missing.'],
      factual_errors: [],
      misconceptions: [],
      question_coverage: 0,
      strengths: [],
      improvements: ['Candidate did not provide a meaningful answer.'],
      technical_feedback: 'No answer provided to evaluate.',
      metadata: {
        processing_time_ms: processingTime,
        model
      }
    };
  }

  private async loadPromptTemplate(): Promise<string> {
    const promptPath = path.resolve(process.cwd(), 'src/prompts/technical-accuracy-checker.md');
    try {
      return await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
      logger.error({ err: error }, 'Prompt template not found, using fallback');
      return `Evaluate technical accuracy of the candidate answer and return JSON.`;
    }
  }

  private buildSystemPrompt(template: string, params: ITechnicalAccuracyCheckerParams): string {
    const topicContext = typeof params.topicMetadata === 'string' 
      ? params.topicMetadata 
      : JSON.stringify(params.topicMetadata);

    const expectedConceptsContext = params.expectedConcepts && params.expectedConcepts.length > 0
      ? params.expectedConcepts.join(', ')
      : 'None provided';

    const analyzerContext = params.candidateAnalyzerOutput
      ? JSON.stringify(params.candidateAnalyzerOutput, null, 2)
      : 'No prior analyzer output provided.';

    return template
      .replace('{{INTERVIEW_QUESTION}}', params.interviewQuestion)
      .replace('{{CANDIDATE_ANSWER}}', params.candidateAnswer)
      .replace('{{TOPIC_METADATA}}', topicContext)
      .replace('{{DIFFICULTY}}', params.difficulty)
      .replace('{{EXPECTED_CONCEPTS}}', expectedConceptsContext)
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
