import { describe, it, expect } from 'vitest';
import { RubricEngine } from '../../src/modules/rubric-engine/RubricEngine';
import { FakeLLMClient } from '../mocks/FakeLLMClient';
import { IRubricEngineParams } from '../../src/modules/rubric-engine/RubricEngineTypes';

describe('RubricEngine', () => {
  const llmClient = new FakeLLMClient();
  const engine = new RubricEngine(llmClient);

  const baseParams: IRubricEngineParams = {
    interviewType: 'TECHNICAL',
    candidateAnswer: 'React is a UI library',
    questionMetadata: { difficulty: 'easy' },
    candidateAnalyzerOutput: { missingConcepts: [] },
    technicalAccuracyOutput: { isAccurate: true },
    followUpEvaluatorOutput: { needsFollowUp: false },
    sessionState: { topic: 'React' },
    weights: {
      technical: 2,
      problemSolving: 1,
      accuracy: 2,
      communication: 1,
      confidence: 1,
      depth: 1
    }
  };

  it('should calculate weighted score and determine grade', async () => {
    llmClient.defaultResponse = JSON.stringify({
      scores: {
        technical: 90,
        communication: 80,
        confidence: 85,
        problemSolving: 80,
        depth: 70,
        accuracy: 95
      },
      reasoning: {
        technical: 'good',
        communication: 'ok',
        confidence: 'ok',
        problemSolving: 'ok',
        depth: 'needs work',
        accuracy: 'great'
      }
    });

    const result = await engine.evaluatePerformance(baseParams);

    // Total weight = 2 + 1 + 2 + 1 + 1 + 1 = 8
    // Tech: 90*2/8 = 22.5
    // Prob: 80*1/8 = 10
    // Acc: 95*2/8 = 23.75
    // Comm: 80*1/8 = 10
    // Conf: 85*1/8 = 10.625
    // Depth: 70*1/8 = 8.75
    // Sum = 22.5 + 10 + 23.75 + 10 + 10.625 + 8.75 = 85.625 -> ~85.6
    expect(result.weightedScore).toBeGreaterThan(85);
    expect(result.grade).toBe('B');
  });

  it('should handle missing fields gracefully due to validator', async () => {
    llmClient.responseOverrides = [
      () => JSON.stringify({
        scores: { technical: 100 } // Others missing
      })
    ];

    const result = await engine.evaluatePerformance(baseParams);

    expect(result.scores.communication).toBe(0);
    expect(result.grade).toBe('F'); // Low score
  });

  it('should retry if JSON is invalid', async () => {
    let call = 0;
    llmClient.responseOverrides = [
      () => {
        call++;
        if (call === 1) return '{ bad json }';
        return JSON.stringify({
          scores: { technical: 95, accuracy: 95, problemSolving: 90, communication: 90, confidence: 90, depth: 90 }
        });
      }
    ];

    const result = await engine.evaluatePerformance(baseParams);
    expect(call).toBe(2);
    expect(result.grade).toBe('A');
  });
});
