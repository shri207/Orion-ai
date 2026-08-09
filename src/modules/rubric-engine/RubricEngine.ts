import fs from 'fs/promises';
import path from 'path';
import { IRubricEngine } from './RubricEngineInterfaces';
import { IRubricEngineParams, IRubricEngineResult, IRubricScores } from './RubricEngineTypes';
import { RubricEngineValidator } from './RubricEngineValidator';
import { ILLMClient, ILLMMessage } from '../../services/llm/LLMInterfaces';
import { logger } from '../../utils/logger';

export class RubricEngine implements IRubricEngine {
  constructor(private readonly llmClient: ILLMClient) {}

  public async evaluatePerformance(params: IRubricEngineParams): Promise<IRubricEngineResult> {
    logger.info('Starting rubric engine evaluation');
    const startTime = Date.now();

    const promptTemplate = await this.loadPromptTemplate();
    const systemPrompt = this.buildSystemPrompt(promptTemplate, params);

    const messages: ILLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate the final evaluation scores and reasoning in strict JSON format.' }
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
        const validResult = RubricEngineValidator.validate(rawJson);
        
        validResult.weightedScore = this.calculateWeightedScore(validResult.scores, params.weights);
        validResult.grade = this.determineGrade(validResult.weightedScore);
        
        if (validResult.metadata) {
           validResult.metadata.processing_time_ms = Date.now() - startTime;
           validResult.metadata.model = response.model;
        }

        logger.info('Rubric evaluation completed successfully');
        return validResult;
      } catch (error: any) {
        validationAttempt++;
        logger.warn({ error: error.message, attempt: validationAttempt }, 'Rubric evaluation validation failed, retrying');
        if (validationAttempt > maxValidationRetries) {
          logger.error('Max validation retries reached for Rubric Engine');
          throw new Error(`Failed to generate valid rubric evaluation after ${maxValidationRetries} retries: ${error.message}`);
        }
      }
    }

    throw new Error('Unexpected exit from validation retry loop');
  }

  private calculateWeightedScore(scores: IRubricScores, weights: any): number {
    const totalWeight = weights.technical + weights.problemSolving + weights.accuracy + weights.communication + weights.confidence + weights.depth;
    
    const wTech = weights.technical / totalWeight;
    const wProb = weights.problemSolving / totalWeight;
    const wAcc = weights.accuracy / totalWeight;
    const wComm = weights.communication / totalWeight;
    const wConf = weights.confidence / totalWeight;
    const wDepth = weights.depth / totalWeight;

    const weightedScore = (scores.technical * wTech) +
                          (scores.problemSolving * wProb) +
                          (scores.accuracy * wAcc) +
                          (scores.communication * wComm) +
                          (scores.confidence * wConf) +
                          (scores.depth * wDepth);
                          
    return Math.round(weightedScore * 10) / 10;
  }

  private determineGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private async loadPromptTemplate(): Promise<string> {
    const promptPath = path.resolve(process.cwd(), 'src/prompts/rubric-engine.md');
    try {
      return await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
      logger.error({ err: error }, 'Prompt template not found, using fallback');
      return `Evaluate candidate performance and return JSON.`;
    }
  }

  private buildSystemPrompt(template: string, params: IRubricEngineParams): string {
    const safeStringify = (obj: any) => obj ? JSON.stringify(obj, null, 2) : 'Not provided';

    return template
      .replace('{{INTERVIEW_TYPE}}', params.interviewType || 'General')
      .replace('{{CANDIDATE_ANSWER}}', params.candidateAnswer)
      .replace('{{QUESTION_METADATA}}', safeStringify(params.questionMetadata))
      .replace('{{CANDIDATE_ANALYZER_OUTPUT}}', safeStringify(params.candidateAnalyzerOutput))
      .replace('{{TECHNICAL_ACCURACY_OUTPUT}}', safeStringify(params.technicalAccuracyOutput))
      .replace('{{FOLLOWUP_EVALUATOR_OUTPUT}}', safeStringify(params.followUpEvaluatorOutput))
      .replace('{{SESSION_STATE}}', safeStringify(params.sessionState));
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
