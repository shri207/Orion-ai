import api from './api';

export interface SessionSummary {
  sessionId:     string;
  candidateId:   string;
  candidateName: string;
  curriculum:    string;
  status:        string;
  score:         number | null;
  startTime:     string | null;
  duration:      number | null;
  reportId:      string | null;
}

export interface SessionsResponse {
  sessions: SessionSummary[];
  total:    number;
  limit:    number;
  offset:   number;
}

export async function getSessions(limit = 20, offset = 0): Promise<SessionsResponse> {
  const res = await api.get<SessionsResponse>('/sessions', { params: { limit, offset } });
  return res.data;
}

export async function getSession(sessionId: string): Promise<SessionSummary> {
  const res = await api.get<SessionSummary>(`/sessions/${sessionId}`);
  return res.data;
}
