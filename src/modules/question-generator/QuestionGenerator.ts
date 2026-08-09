import { IQuestionGenerator } from './QuestionGeneratorInterfaces';
import { IQuestionGeneratorParams, IGeneratedQuestion } from './QuestionGeneratorTypes';
import { QuestionGeneratorValidator } from './QuestionGeneratorValidator';
import { ILLMClient, ILLMMessage } from '../../services/llm/LLMInterfaces';
import { IRagService } from '../rag/RagTypes';
import { logger } from '../../utils/logger';
import fs from 'fs/promises';
import path from 'path';

export class QuestionGenerator implements IQuestionGenerator {
  constructor(
    private readonly llmClient: ILLMClient,
    private readonly ragService?: IRagService
  ) {}

  public async generateQuestion(params: IQuestionGeneratorParams): Promise<IGeneratedQuestion> {
    const { topic, difficulty, interviewType, interviewRole, candidateProfile, previousQuestions, additionalContext } = params;
    
    logger.info({ topicId: topic.id, difficulty, interviewType }, 'Starting question generation');

    // RAG: retrieve curriculum context for this topic
    let ragContext = 'No additional curriculum context available.';
    if (this.ragService?.isReady) {
      const ragQuery = `${topic.name} ${topic.description ?? ''}`;
      const ragResult = await this.ragService.retrieveContext(topic.id, ragQuery);
      ragContext = ragResult.context;
      logger.debug({ topicId: topic.id }, '[RAG] Context retrieved for question generation');
    }
    
    const promptTemplate = await this.loadPromptTemplate();
    const systemPrompt = this.buildSystemPrompt(promptTemplate, params, ragContext);
    
    const messages: ILLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate the next interview question according to the rules and return only valid JSON.' }
    ];

    const maxValidationRetries = 2;
    let validationAttempt = 0;

    while (validationAttempt <= maxValidationRetries) {
      try {
        const response = await this.llmClient.generateCompletion(messages, {
          responseFormat: 'json_object'
        });

        const rawJson = this.parseJsonFromResponse(response.content);
        const validQuestion = QuestionGeneratorValidator.validate(rawJson, topic.id, difficulty);
        
        logger.info({ topicId: topic.id }, 'Question generated successfully');
        return validQuestion;
      } catch (error: any) {
        validationAttempt++;
        logger.warn({ error: error.message, attempt: validationAttempt }, 'Question validation failed, retrying generation');
        if (validationAttempt > maxValidationRetries) {
          logger.error('Max validation retries reached');
          throw new Error(`Failed to generate a valid question after ${maxValidationRetries} retries: ${error.message}`);
        }
      }
    }
    
    throw new Error('Unexpected exit from validation retry loop');
  }

  private async loadPromptTemplate(): Promise<string> {
    const promptPath = path.resolve(process.cwd(), 'src/prompts/question-generator.md');
    try {
      return await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
      logger.error({ err: error }, 'Prompt template not found, using fallback');
      return `You are an expert technical interviewer...\n# Topic: {{TOPIC_NAME}}\n# Difficulty: {{DIFFICULTY}}\nReturn JSON only.`;
    }
  }

  private buildSystemPrompt(template: string, params: IQuestionGeneratorParams, ragContext: string): string {
    const candidateContext = params.candidateProfile 
      ? `Candidate Experience: ${params.candidateProfile.yearsOfExperience} years. Background: ${params.candidateProfile.resumeSummary}`
      : 'No candidate background provided.';

    const previousQContext = params.previousQuestions.length > 0
      ? `Previously Asked Questions (DO NOT REPEAT THESE):\n${params.previousQuestions.map(q => `- ${q}`).join('\n')}`
      : 'No previous questions asked.';

    let prompt = template
      .replace('{{INTERVIEW_TYPE}}', params.interviewType)
      .replace('{{INTERVIEW_ROLE}}', params.interviewRole)
      .replace('{{TOPIC_NAME}}', params.topic.name)
      .replace('{{TOPIC_DESCRIPTION}}', params.topic.description)
      .replace('{{DIFFICULTY}}', params.difficulty)
      .replace('{{CANDIDATE_CONTEXT}}', candidateContext)
      .replace('{{PREVIOUS_QUESTIONS}}', previousQContext)
      .replace('{{RAG_CONTEXT}}', ragContext)
      .replace('{{ADDITIONAL_CONTEXT}}', params.additionalContext || 'None');

    return prompt;
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
