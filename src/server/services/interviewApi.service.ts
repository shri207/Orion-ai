export interface IStartInterviewParams {
  candidateId: string;
  role: string;
  difficulty: string;
  interviewType: string;
}

export interface IAnswerParams {
  answer: string;
  timestamp?: string;
  audioMetadata?: any;
}

export interface IInterviewApiService {
  startInterview(params: IStartInterviewParams): Promise<{ sessionId: string, firstQuestion: any, metadata: any }>;
  getNextQuestion(sessionId: string): Promise<{ question: any, isFinished: boolean }>;
  submitAnswer(sessionId: string, params: IAnswerParams): Promise<{ evaluationSummary: any, score: number, followUpRequired: boolean }>;
  endInterview(sessionId: string): Promise<{ interviewSummary: any, reportId: string, overallScore: number }>;
}

export class InterviewApiService implements IInterviewApiService {
  constructor() {}

  public async startInterview(params: IStartInterviewParams) {
    if (!params.candidateId || !params.role || !params.difficulty || !params.interviewType) {
      throw new Error('Missing required parameters');
    }
    return {
      sessionId: `sess_${Date.now()}`,
      firstQuestion: { id: 'q1', text: 'Tell me about yourself.' },
      metadata: { role: params.role, difficulty: params.difficulty }
    };
  }

  public async getNextQuestion(sessionId: string) {
    if (!sessionId) throw new Error('Session ID is required');
    return {
      question: { id: 'q2', text: 'What is your experience with Node.js?' },
      isFinished: false
    };
  }

  public async submitAnswer(sessionId: string, params: IAnswerParams) {
    if (!sessionId) throw new Error('Session ID is required');
    if (!params.answer) throw new Error('Answer is required');
    
    return {
      evaluationSummary: 'Good response.',
      score: 85,
      followUpRequired: false
    };
  }

  public async endInterview(sessionId: string) {
    if (!sessionId) throw new Error('Session ID is required');
    
    return {
      interviewSummary: 'Candidate did well.',
      reportId: `rep_${Date.now()}`,
      overallScore: 82
    };
  }
}
