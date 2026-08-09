import { IGeneratedFollowUp } from './FollowUpGeneratorTypes';
import { InterviewDifficulty } from '../candidate/CandidateTypes';

export class FollowUpGeneratorValidator {
  public static validate(data: any, requestedDifficulty: InterviewDifficulty): IGeneratedFollowUp {
    if (!data || typeof data !== 'object') {
      throw new Error('Parsed response is not an object');
    }

    if (!data.followUpQuestion || typeof data.followUpQuestion !== 'string' || data.followUpQuestion.trim() === '') {
      throw new Error('Invalid or empty followUpQuestion');
    }

    if (!data.reasonForFollowUp || typeof data.reasonForFollowUp !== 'string') {
      throw new Error('Invalid reasonForFollowUp');
    }

    if (!data.detectedKnowledgeGap || typeof data.detectedKnowledgeGap !== 'string') {
      data.detectedKnowledgeGap = 'None specified';
    }

    if (!data.focusArea || typeof data.focusArea !== 'string') {
      data.focusArea = 'General';
    }

    if (!data.expectedAnswerSummary || typeof data.expectedAnswerSummary !== 'string') {
      throw new Error('Invalid expectedAnswerSummary');
    }

    if (!Array.isArray(data.evaluationCriteria) || data.evaluationCriteria.length === 0) {
      throw new Error('evaluationCriteria must be a non-empty array');
    }

    const validDifficulties: InterviewDifficulty[] = ['Easy', 'Medium', 'Hard', 'Expert'];
    if (!validDifficulties.includes(data.difficulty)) {
      data.difficulty = requestedDifficulty;
    }

    if (!data.metadata || typeof data.metadata !== 'object') {
      data.metadata = {};
    }

    return data as IGeneratedFollowUp;
  }
}
