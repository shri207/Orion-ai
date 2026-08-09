import fs from 'fs/promises';
import path from 'path';
import { IHiringRecommendationEngine } from './HiringRecommendationEngineInterfaces';
import { 
  IHiringRecommendationEngineParams, 
  IHiringRecommendationResult, 
  IHiringDecisionConfig,
  HiringRecommendationDecision
} from './HiringRecommendationEngineTypes';
import { HiringRecommendationEngineValidator } from './HiringRecommendationEngineValidator';
import { ILLMClient, ILLMMessage } from '../../services/llm/LLMInterfaces';
import { logger } from '../../utils/logger';

export class HiringRecommendationEngine implements IHiringRecommendationEngine {
  constructor(
    private readonly llmClient: ILLMClient,
    private readonly config: IHiringDecisionConfig
  ) {}

  public async evaluateRecommendation(params: IHiringRecommendationEngineParams): Promise<IHiringRecommendationResult> {
    logger.info('Starting hiring recommendation evaluation');
    const startTime = Date.now();

    const promptTemplate = await this.loadPromptTemplate();
    const systemPrompt = this.buildSystemPrompt(promptTemplate, params);

    const messages: ILLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate the hiring recommendation report in strictly valid JSON format.' }
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
        const validResult = HiringRecommendationEngineValidator.validate(rawJson);
        
        validResult.metadata.processing_time_ms = Date.now() - startTime;
        validResult.metadata.model = response.model;

        // Apply deterministic adjustments based on config overrides
        validResult.recommendation = this.applyDeterministicRules(validResult, params);

        logger.info('Hiring recommendation evaluation completed successfully');
        return validResult;
      } catch (error: any) {
        validationAttempt++;
        logger.warn({ error: error.message, attempt: validationAttempt }, 'Hiring recommendation validation failed, retrying');
        if (validationAttempt > maxValidationRetries) {
          logger.error('Max validation retries reached for Hiring Recommendation Engine');
          throw new Error(`Failed to generate valid hiring recommendation after ${maxValidationRetries} retries: ${error.message}`);
        }
      }
    }

    throw new Error('Unexpected exit from validation retry loop');
  }

  private applyDeterministicRules(result: IHiringRecommendationResult, params: IHiringRecommendationEngineParams): HiringRecommendationDecision {
    let finalScore = result.overallScore;

    const gapPenalty = result.criticalGaps.length * this.config.criticalGapPenalty;
    
    let totalSevereErrors = 0;
    if (params.technicalAccuracyReports) {
      params.technicalAccuracyReports.forEach(report => {
        totalSevereErrors += report.factual_errors.filter(e => e.severity === 'high').length;
      });
    }
    const errorPenalty = totalSevereErrors * this.config.severeFactualErrorPenalty;

    finalScore = finalScore - gapPenalty - errorPenalty;
    
    if (finalScore < this.config.minimumHireScore || result.decisionFactors.technical < this.config.minimumTechnicalScore) {
      return finalScore < (this.config.minimumHireScore - 15) ? 'Strong No Hire' : 'No Hire';
    } else if (finalScore >= 90) {
      return 'Strong Hire';
    } else if (finalScore >= 80) {
      return 'Hire';
    } else if (finalScore >= this.config.minimumHireScore) {
      return 'Lean Hire';
    }
    
    return 'Maybe';
  }

  private async loadPromptTemplate(): Promise<string> {
    const promptPath = path.resolve(process.cwd(), 'src/prompts/hiring-recommendation-engine.md');
    try {
      return await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
      logger.error({ err: error }, 'Prompt template not found, using fallback');
      return `Evaluate hiring recommendation and return JSON.`;
    }
  }

  private buildSystemPrompt(template: string, params: IHiringRecommendationEngineParams): string {
    const safeStringify = (obj: any) => obj ? JSON.stringify(obj, null, 2) : 'Not provided';

    return template
      .replace('{{INTERVIEW_TYPE}}', params.interviewType || 'General')
      .replace('{{SESSION_SUMMARY}}', safeStringify(params.sessionSummary))
      .replace('{{RUBRIC_ENGINE_OUTPUT}}', safeStringify(params.rubricEngineOutput))
      .replace('{{SKILL_MATRIX}}', safeStringify(params.skillMatrix))
      .replace('{{TECHNICAL_ACCURACY_REPORTS}}', safeStringify(params.technicalAccuracyReports))
      .replace('{{CANDIDATE_ANALYSIS_RESULTS}}', safeStringify(params.candidateAnalysisResults));
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
