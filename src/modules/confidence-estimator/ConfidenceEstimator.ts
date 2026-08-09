import fs from 'fs/promises';
import path from 'path';
import { IConfidenceEstimator } from './ConfidenceEstimatorInterfaces';
import { IConfidenceEstimatorParams, IConfidenceEstimatorResult } from './ConfidenceEstimatorTypes';
import { ConfidenceEstimatorValidator } from './ConfidenceEstimatorValidator';
import { ILLMClient, ILLMMessage } from '../../services/llm/LLMInterfaces';
import { logger } from '../../utils/logger';

export class ConfidenceEstimator implements IConfidenceEstimator {
  constructor(private readonly llmClient: ILLMClient) {}

  public async estimateConfidence(params: IConfidenceEstimatorParams): Promise<IConfidenceEstimatorResult> {
    logger.info('Starting confidence estimation');
    const startTime = Date.now();

    if (!params.candidateAnswer || params.candidateAnswer.trim().length < 2) {
      return this.buildEmptyResult(Date.now() - startTime, 'No model');
    }

    const promptTemplate = await this.loadPromptTemplate();
    const systemPrompt = this.buildSystemPrompt(promptTemplate, params);

    const messages: ILLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Evaluate the candidate\'s confidence level and return strictly valid JSON.' }
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
        const validResult = ConfidenceEstimatorValidator.validate(rawJson);
        
        validResult.metadata.processing_time_ms = Date.now() - startTime;
        validResult.metadata.model = response.model;

        logger.info('Confidence estimation completed successfully');
        return validResult;
      } catch (error: any) {
        validationAttempt++;
        logger.warn({ error: error.message, attempt: validationAttempt }, 'Confidence estimation validation failed, retrying');
        if (validationAttempt > maxValidationRetries) {
          logger.error('Max validation retries reached for Confidence Estimator');
          throw new Error(`Failed to generate valid confidence estimation after ${maxValidationRetries} retries: ${error.message}`);
        }
      }
    }

    throw new Error('Unexpected exit from validation retry loop');
  }

  private buildEmptyResult(processingTime: number, model: string): IConfidenceEstimatorResult {
    return {
      overall_confidence_score: 0,
      confidence_level: 'Very Low',
      confidence_indicators: [],
      uncertainty_indicators: ['No answer provided'],
      hesitation_signals: [],
      bluffing_probability: 0,
      overconfidence_probability: 0,
      consistency_score: 0,
      claim_confidence: [],
      language_patterns: {
        certain_phrases: [],
        uncertain_phrases: [],
        hedging_phrases: [],
        speculative_phrases: []
      },
      behavioral_summary: 'The candidate did not provide an answer, showing lack of engagement or extreme lack of confidence.',
      recommendations: ['Ask a simpler question to build confidence.'],
      metadata: {
        processing_time_ms: processingTime,
        model
      }
    };
  }

  private async loadPromptTemplate(): Promise<string> {
    const promptPath = path.resolve(process.cwd(), 'src/prompts/confidence-estimator.md');
    try {
      return await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
      logger.error({ err: error }, 'Prompt template not found, using fallback');
      return `Evaluate candidate confidence and return JSON.`;
    }
  }

  private buildSystemPrompt(template: string, params: IConfidenceEstimatorParams): string {
    const analyzerContext = params.candidateAnalyzerOutput
      ? JSON.stringify(params.candidateAnalyzerOutput, null, 2)
      : 'No prior analyzer output provided.';
      
    const communicationContext = params.communicationAnalyzerOutput
      ? JSON.stringify(params.communicationAnalyzerOutput, null, 2)
      : 'No prior communication output provided.';

    return template
      .replace('{{INTERVIEW_QUESTION}}', params.interviewQuestion)
      .replace('{{CANDIDATE_ANSWER}}', params.candidateAnswer)
      .replace('{{CANDIDATE_ANALYZER_OUTPUT}}', analyzerContext)
      .replace('{{COMMUNICATION_ANALYZER_OUTPUT}}', communicationContext);
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
