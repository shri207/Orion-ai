import { create } from 'zustand';

export const MAX_QUESTIONS = 10;

export type InterviewStatus =
  | 'idle'
  | 'starting'
  | 'active'
  | 'thinking'
  | 'ending'
  | 'done'
  | 'error';

export interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: number;
}

export interface AnswerRecord {
  question: string;
  answer: string;
  /** 0–100 quality score inferred from difficulty */
  score: number;
  difficulty: string;
  topic: string;
}

export interface InterviewStore {
  // Auth
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;

  // Session
  sessionId: string | null;
  status: InterviewStatus;
  questionNumber: number;
  totalQuestions: number;
  elapsedSeconds: number;
  currentTopic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completedTopics: string[];
  remainingTopics: string[];
  messages: Message[];
  agentReasoning: string;
  confidenceScore: number;
  reportId: string | null;
  answerHistory: AnswerRecord[];
  _pendingQuestion: string;

  // Selected candidate/curriculum for prepare page
  selectedCandidateId: string | null;
  selectedCurriculum: string | null;

  // Actions
  setSession: (sessionId: string, firstQuestion: string) => void;
  addMessage: (role: 'ai' | 'user', content: string) => void;
  setStatus: (status: InterviewStatus) => void;
  /** Call after receiving the AI's next question. Pass answerText so we can record the pair. */
  setNextQuestion: (question: string, reasoning?: string, difficulty?: 'Easy' | 'Medium' | 'Hard', answerText?: string, score?: number, topic?: string) => void;
  tickTimer: () => void;
  setReportId: (reportId: string) => void;
  selectCandidate: (candidateId: string) => void;
  selectCurriculum: (curriculum: string) => void;
  resetSession: () => void;
}

const initialSession = {
  sessionId: null,
  status: 'idle' as InterviewStatus,
  questionNumber: 0,
  totalQuestions: MAX_QUESTIONS,
  elapsedSeconds: 0,
  currentTopic: '',
  difficulty: 'Medium' as const,
  completedTopics: [] as string[],
  remainingTopics: [] as string[],
  messages: [] as Message[],
  agentReasoning: '',
  confidenceScore: 0,
  reportId: null,
  answerHistory: [] as AnswerRecord[],
  _pendingQuestion: '',
};

let msgCounter = 0;

function computeConfidence(history: AnswerRecord[]): number {
  if (history.length === 0) return 0;
  const recent = history.slice(-5);
  const avg = recent.reduce((s, r) => s + r.score, 0) / recent.length;
  return Math.round(avg);
}

export const useInterviewStore = create<InterviewStore>((set) => ({
  // Auth
  token: localStorage.getItem('ia_token'),
  setToken: (token) => {
    localStorage.setItem('ia_token', token);
    set({ token });
  },
  clearToken: () => {
    localStorage.removeItem('ia_token');
    set({ token: null });
  },

  // Session
  ...initialSession,
  selectedCandidateId: null,
  selectedCurriculum: null,

  setSession: (sessionId, firstQuestion) =>
    set({
      sessionId,
      status: 'active',
      questionNumber: 1,
      _pendingQuestion: firstQuestion,
      messages: [{ id: `msg-${++msgCounter}`, role: 'ai', content: firstQuestion, timestamp: Date.now() }],
    }),

  addMessage: (role, content) =>
    set((s) => ({
      messages: [...s.messages, { id: `msg-${++msgCounter}`, role, content, timestamp: Date.now() }],
    })),

  setStatus: (status) => set({ status }),

  setNextQuestion: (question, reasoning, difficulty, answerText, score, topic) =>
    set((s) => {
      const newRecord: AnswerRecord | null = answerText
        ? {
            question: s._pendingQuestion,
            answer: answerText,
            // Use the real backend score if available; fall back to difficulty proxy
            score: typeof score === 'number' ? score
                 : difficulty === 'Hard' ? 75
                 : difficulty === 'Easy' ? 45 : 60,
            difficulty: difficulty ?? s.difficulty,
            topic: topic ?? s.currentTopic,
          }
        : null;

      const newHistory = newRecord ? [...s.answerHistory, newRecord] : s.answerHistory;
      const newConfidence = computeConfidence(newHistory);

      return {
        status: 'active',
        questionNumber: s.questionNumber + 1,
        messages: [...s.messages, { id: `msg-${++msgCounter}`, role: 'ai', content: question, timestamp: Date.now() }],
        agentReasoning: reasoning ?? s.agentReasoning,
        difficulty: difficulty ?? s.difficulty,
        currentTopic: topic ?? s.currentTopic,
        answerHistory: newHistory,
        confidenceScore: newConfidence,
        _pendingQuestion: question,
      };
    }),

  tickTimer: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),

  setReportId: (reportId) => set({ reportId, status: 'done' }),

  selectCandidate: (candidateId) => set({ selectedCandidateId: candidateId }),
  selectCurriculum: (curriculum) => set({ selectedCurriculum: curriculum }),

  resetSession: () => set({ ...initialSession, selectedCandidateId: null, selectedCurriculum: null }),
}));
