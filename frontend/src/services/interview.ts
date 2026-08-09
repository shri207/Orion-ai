import api from './api';

export interface StartInterviewResponse {
  sessionId: string;
  question: string;
}

export interface AnswerResponse {
  success: boolean;
  nextQuestion?: string;
  reasoning?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  confidence?: number;
  completed?: boolean;
  /** Real per-question score (0-100) from the backend scoring engine */
  score?: number | null;
  /** The topic this question was asked under */
  topic?: string | null;
}

export interface EndInterviewResponse {
  summary: string;
  reportId: string;
}

/** POST /api/auth/guest → { token } */
export async function getGuestToken(): Promise<string> {
  const res = await api.post<{ token: string }>('/auth/guest');
  return res.data.token;
}

/** POST /api/interview/start */
export async function startInterview(
  candidateId: string,
  curriculum: string
): Promise<StartInterviewResponse> {
  const res = await api.post<StartInterviewResponse>('/interview/start', {
    candidateId,
    curriculum,
  });
  return res.data;
}

/** POST /api/interview/answer */
export async function submitAnswer(
  sessionId: string,
  answer: string,
  timeTakenMs?: number
): Promise<AnswerResponse> {
  const res = await api.post<AnswerResponse>('/interview/answer', {
    sessionId,
    answer,
    ...(timeTakenMs !== undefined && { timeTakenMs }),
  });
  return res.data;
}

/** POST /api/interview/end */
export async function endInterview(sessionId: string): Promise<EndInterviewResponse> {
  const res = await api.post<EndInterviewResponse>('/interview/end', { sessionId });
  return res.data;
}
