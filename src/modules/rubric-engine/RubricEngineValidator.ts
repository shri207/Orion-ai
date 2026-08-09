import { IRubricEngineResult, IRubricScores, IRubricReasoning } from './RubricEngineTypes';

export class RubricEngineValidator {
  public static validate(data: any): IRubricEngineResult {
    if (!data || typeof data !== 'object') {
      throw new Error('Parsed response is not an object');
    }

    const defaultScores: IRubricScores = {
      technical: 0,
      communication: 0,
      confidence: 0,
      problemSolving: 0,
      depth: 0,
      accuracy: 0
    };

    const defaultReasoning: IRubricReasoning = {
      technical: '',
      communication: '',
      confidence: '',
      problemSolving: '',
      depth: '',
      accuracy: ''
    };

    const scores = data.scores || defaultScores;
    const reasoning = data.reasoning || defaultReasoning;

    return {
      scores: {
        technical: typeof scores.technical === 'number' ? scores.technical : 0,
        communication: typeof scores.communication === 'number' ? scores.communication : 0,
        confidence: typeof scores.confidence === 'number' ? scores.confidence : 0,
        problemSolving: typeof scores.problemSolving === 'number' ? scores.problemSolving : 0,
        depth: typeof scores.depth === 'number' ? scores.depth : 0,
        accuracy: typeof scores.accuracy === 'number' ? scores.accuracy : 0,
      },
      weightedScore: typeof data.weightedScore === 'number' ? data.weightedScore : 0,
      grade: typeof data.grade === 'string' ? data.grade : 'F',
      reasoning: {
        technical: typeof reasoning.technical === 'string' ? reasoning.technical : '',
        communication: typeof reasoning.communication === 'string' ? reasoning.communication : '',
        confidence: typeof reasoning.confidence === 'string' ? reasoning.confidence : '',
        problemSolving: typeof reasoning.problemSolving === 'string' ? reasoning.problemSolving : '',
        depth: typeof reasoning.depth === 'string' ? reasoning.depth : '',
        accuracy: typeof reasoning.accuracy === 'string' ? reasoning.accuracy : '',
      },
      metadata: {
        processing_time_ms: typeof data.metadata?.processing_time_ms === 'number' ? data.metadata.processing_time_ms : 0,
        model: typeof data.metadata?.model === 'string' ? data.metadata.model : 'Unknown'
      }
    };
  }
}
