export interface ITransaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface IDatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  beginTransaction(): Promise<ITransaction>;
}

export interface ICandidateProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  experienceLevel: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInterviewSession {
  id: string;
  candidateId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  metadata: Record<string, any>;
}

export interface IInterviewReport {
  id: string;
  interviewId: string;
  overallScore: number;
  reportData: Record<string, any>;
  generatedAt: Date;
}

export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: Record<string, any>): Promise<T[]>;
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface ICandidateProfileRepository extends IRepository<ICandidateProfile> {
  findByEmail(email: string): Promise<ICandidateProfile | null>;
}

export interface IInterviewSessionRepository extends IRepository<IInterviewSession> {
  findByCandidateId(candidateId: string): Promise<IInterviewSession[]>;
}

export interface IInterviewReportRepository extends IRepository<IInterviewReport> {
  findByInterviewId(interviewId: string): Promise<IInterviewReport | null>;
}
