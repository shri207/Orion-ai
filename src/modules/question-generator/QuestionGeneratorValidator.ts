import { IGeneratedQuestion } from './QuestionGeneratorTypes';
import { InterviewDifficulty } from '../candidate/CandidateTypes';

export class QuestionGeneratorValidator {
  public static validate(data: any, expectedTopicId: string, requestedDifficulty: InterviewDifficulty): IGeneratedQuestion {
    if (!data || typeof data !== 'object') {
      throw new Error('Parsed response is not an object');
    }

    if (!data.question || typeof data.question !== 'string' || data.question.trim() === '') {
      throw new Error('Invalid or empty question');
    }

    if (!data.expectedAnswerSummary || typeof data.expectedAnswerSummary !== 'string') {
      throw new Error('Invalid expectedAnswerSummary');
    }

    if (!Array.isArray(data.evaluationCriteria) || data.evaluationCriteria.length === 0) {
      throw new Error('evaluationCriteria must be a non-empty array');
    }

    if (data.topic !== expectedTopicId) {
      data.topic = expectedTopicId;
    }

    const validDifficulties: InterviewDifficulty[] = ['Easy', 'Medium', 'Hard', 'Expert'];
    if (!validDifficulties.includes(data.difficulty)) {
      data.difficulty = requestedDifficulty;
    }

    if (typeof data.estimatedAnswerTime !== 'number') {
      data.estimatedAnswerTime = 2; // Default 2 minutes
    }

    if (!Array.isArray(data.followUpHints)) {
      data.followUpHints = [];
    }

    if (!data.metadata || typeof data.metadata !== 'object') {
      data.metadata = {};
    }

    return data as IGeneratedQuestion;
  }
}
