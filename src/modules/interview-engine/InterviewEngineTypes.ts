export interface IInterviewEngineDependencies {
  sessionManager: {
    createSession(candidateId: string, roleId: string): Promise<{ id: string, interviewId: string }>;
    closeSession(sessionId: string): Promise<void>;
  };
  
  curriculumLoader: {
    loadCurriculum(roleId: string): Promise<any>;
  };
  
  topicSelector: {
    getNextTopic(sessionId: string, curriculum: any): Promise<string | null>;
  };
  
  topicPerformanceTracker: {
    recordPerformance(sessionId: string, topicId: string, evaluation: { score: number, technicalAccuracy: number, confidence?: number, isHintUsed?: boolean, followUp?: boolean, timeTakenMs?: number }): Promise<void>;
  };
  
  questionGenerator: {
    generate(topic: string, candidateState: any, difficulty: string): Promise<{ text: string, expectedConcepts: string[] }>;
  };
  
  answerValidator: {
    validate(answer: string): Promise<{ isValid: boolean, error?: string }>;
  };
  
  candidateAnalyzer: {
    analyze(answer: string, expectedConcepts: string[]): Promise<any>;
  };
  
  scoringEngine: {
    score(analysis: any): Promise<number>;
  };
  
  followUpGenerator: {
    needsFollowUp(analysis: any): boolean;
    generateFollowUp(analysis: any, previousQuestion: string): Promise<string>;
  };
  
  reportGenerator: {
    generateReport(sessionId: string, interviewId: string, history: any[]): Promise<any>;
  };
  
  database: {
    candidateProfiles: { findById(id: string): Promise<any> };
    interviewReports: { create(data: any): Promise<any>, findByInterviewId(interviewId: string): Promise<any> };
    interviewSessions: { update(id: string, data: any): Promise<any> };
  };
  
  websocketManager: {
    sendMessageToSession(sessionId: string, type: string, payload: any): void;
  };
  
  monitoring: {
    recordLlmCall(payload: any): void;
    incrementCounter(name: string, value?: number, tags?: any): void;
  };
  
  errorHandler: {
    logError(error: Error, requestId?: string): void;
  };
  
  contextManager: {
    initializeContext(sessionId: string): Promise<void>;
    addToHistory(sessionId: string, role: 'interviewer' | 'candidate', content: string): Promise<void>;
    getHistory(sessionId: string): Promise<any[]>;
  };
  
  stateStore: {
    getSessionState(sessionId: string): Promise<import('./InterviewEngineTypes').IInterviewSessionState | null>;
    setSessionState(sessionId: string, state: import('./InterviewEngineTypes').IInterviewSessionState): Promise<void>;
    deleteSessionState(sessionId: string): Promise<void>;
  };

  adaptiveDifficulty: {
    calculateNextDifficulty(
      currentScore: number,
      history: any[],
      opts?: { timeTakenMs?: number; confidenceScore?: number }
    ): string;
  };
  
  promptSecurity?: {
    analyzeAndProcess(prompt: string, sessionId: string): string;
  };

  /** Optional: Hiring Recommendation Engine — wired up in Feature 7 */
  hiringRecommendationEngine?: {
    evaluateRecommendation(params: any): Promise<{
      recommendation: string;
      confidence: number;
      overallScore: number;
      strengths: string[];
      weaknesses: string[];
      reasoning: string[];
    }>;
  };
}

export enum InterviewState {
  INITIALIZING = 'INITIALIZING',
  WAITING_FOR_ANSWER = 'WAITING_FOR_ANSWER',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface ISubmitAnswerResult {
  /** The next question text, present when interview is still active */
  nextQuestion?: string;
  /** True when all topics have been exhausted and the interview is complete */
  completed: boolean;
  /** The AI's internal reasoning used to select the next question */
  reasoning?: string;
  /** Difficulty level assigned to the next question */
  difficulty?: string;
  /** True when the backend detected that the 120s time limit was exceeded */
  timedOut?: boolean;
}

export interface IInterviewSessionState {
  sessionId: string;
  interviewId: string;
  candidateId: string;
  roleId: string;
  status: InterviewState;
  currentTopic: string | null;
  currentQuestion: string | null;
  expectedConcepts: string[];
  isFollowUp: boolean;
  difficulty: string;
  curriculum: any;
  scoreAccumulator: number;
  questionCount: number;
  /** Unix timestamp (ms) when the current question was sent, for server-side timing */
  questionStartTime?: number;
  /** Number of consecutive follow-up questions asked on the current topic (max 2) */
  followUpCount: number;
  /** How many questions have been asked on the current topic (advance after 2) */
  questionsOnCurrentTopic: number;
  /** Unix timestamp (ms) when the interview started — used to compute duration */
  startedAt?: number;
}
