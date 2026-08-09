import { describe, it, expect } from 'vitest';
import { QuestionGenerator } from '../../src/modules/question-generator/QuestionGenerator';
import { FakeLLMClient } from '../mocks/FakeLLMClient';
import { IQuestionGeneratorParams } from '../../src/modules/question-generator/QuestionGeneratorTypes';

describe('QuestionGenerator', () => {
  const llmClient = new FakeLLMClient();
  const generator = new QuestionGenerator(llmClient);

  const baseParams: IQuestionGeneratorParams = {
    topic: { id: 't1', name: 'React Hooks', description: 'Testing hooks' },
    difficulty: 'medium',
    interviewType: 'TECHNICAL',
    interviewRole: 'Frontend Developer',
    previousQuestions: [],
    candidateProfile: {
      id: 'cand-1',
      name: 'John',
      email: 'john@example.com',
      role: 'Dev',
      yearsOfExperience: 3,
      resumeSummary: 'React dev',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };

  it('should generate a valid question from LLM response', async () => {
    llmClient.defaultResponse = JSON.stringify({
      question: 'What are the rules of Hooks?',
      expectedAnswerSummary: 'Explain top level and React functions only.',
      evaluationCriteria: ['Top level only', 'React functions only'],
      topic: 't1',
      difficulty: 'Medium'
    });

    const result = await generator.generateQuestion(baseParams);

    expect(result.question).toBe('What are the rules of Hooks?');
    expect(result.evaluationCriteria).toHaveLength(2);
    expect(llmClient.callCount).toBe(1);
    expect(llmClient.lastMessages[0].role).toBe('system');
    expect(llmClient.lastMessages[0].content).toContain('React Hooks'); // Topic name in prompt
    expect(llmClient.lastMessages[0].content).toContain('3 years'); // Candidate context
  });

  it('should retry if validation fails and eventually succeed', async () => {
    let call = 0;
    llmClient.responseOverrides = [
      () => {
        call++;
        if (call === 1) {
          // Invalid response (missing expectedAnswerSummary)
          return JSON.stringify({ question: 'Bad question' });
        }
        return JSON.stringify({
          question: 'Good question',
          expectedAnswerSummary: 'summary',
          evaluationCriteria: ['Concept'],
          topic: 't1',
          difficulty: 'Medium'
        });
      }
    ];

    const result = await generator.generateQuestion(baseParams);

    expect(result.question).toBe('Good question');
    expect(call).toBe(2);
  });

  it('should throw an error if validation fails repeatedly', async () => {
    llmClient.responseOverrides = [
      () => JSON.stringify({ text: 'Always bad' })
    ];

    await expect(generator.generateQuestion(baseParams)).rejects.toThrow('Failed to generate a valid question');
  });

  it('should format previous questions in prompt', async () => {
    llmClient.responseOverrides = [
      () => JSON.stringify({ 
        question: 'Q2', 
        expectedAnswerSummary: 'sum', 
        evaluationCriteria: ['C2'],
        topic: 't1',
        difficulty: 'Medium'
      })
    ];

    await generator.generateQuestion({
      ...baseParams,
      previousQuestions: ['What is React?']
    });

    expect(llmClient.lastMessages[0].content).toContain('What is React?');
  });
});
