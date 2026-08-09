import candidatesData from '../data/candidates.json';

export interface CandidateMission {
  day: number;
  title: string;
  passed?: boolean;
  skipped?: boolean;
  attempts?: number;
}

export interface CandidateSignals {
  commitDays: number;
  missionsCompleted: number;
  missionsFirstTry: number;
}

export interface Candidate {
  member: {
    id: string;
    name: string;
    jobRole: string;
    yearsExperience: number;
    education: string;
    status: string;
  };
  missions: CandidateMission[];
  signals: CandidateSignals;
}

export async function fetchCandidates(): Promise<Candidate[]> {
  return candidatesData.candidates as Candidate[];
}
