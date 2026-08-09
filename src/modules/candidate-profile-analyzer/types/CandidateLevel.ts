export enum CandidateLevel {
  BEGINNER = 'BEGINNER',
  JUNIOR = 'JUNIOR',
  MID_LEVEL = 'MID_LEVEL',
  SENIOR = 'SENIOR',
  STAFF = 'STAFF',
  PRINCIPAL = 'PRINCIPAL'
}

export interface ICandidateLevelConfidence {
  value: CandidateLevel;
  confidence: number;
}
