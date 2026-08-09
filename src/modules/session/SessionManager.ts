import { ISession, ISessionRepository, ICreateSessionParams } from './SessionInterfaces';
import { SessionStatus, SessionId } from './SessionTypes';
import { generateSessionId } from './SessionUtils';
import { logger } from '../../utils/logger';

export class SessionManager {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  public async createSession(params: ICreateSessionParams): Promise<ISession> {
    const now = new Date();
    const session: ISession = {
      sessionId: generateSessionId(),
      candidateId: params.candidateId,
      currentTopic: null,
      currentQuestion: null,
      answeredQuestions: [],
      metadata: params.metadata || {},
      status: SessionStatus.CREATED,
      createdAt: now,
      updatedAt: now,
    };

    const interviewId = await this.sessionRepository.save(session);
    session.interviewId = interviewId;
    
    logger.info({ sessionId: session.sessionId, interviewId, candidateId: params.candidateId }, 'Interview session created');
    return session;
  }

  public async resumeSession(sessionId: SessionId): Promise<ISession> {
    const session = await this.getSession(sessionId);
    
    if (session.status === SessionStatus.COMPLETED || session.status === SessionStatus.ABANDONED) {
      throw new Error(`Cannot resume session. Current status is: ${session.status}`);
    }

    return this.updateSessionStatus(sessionId, SessionStatus.ACTIVE);
  }

  public async endSession(sessionId: SessionId): Promise<ISession> {
    return this.updateSessionStatus(sessionId, SessionStatus.COMPLETED);
  }
  
  public async abandonSession(sessionId: SessionId): Promise<ISession> {
    return this.updateSessionStatus(sessionId, SessionStatus.ABANDONED);
  }

  public async pauseSession(sessionId: SessionId): Promise<ISession> {
    return this.updateSessionStatus(sessionId, SessionStatus.PAUSED);
  }

  public async saveSessionState(sessionId: SessionId, stateUpdates: Partial<ISession>): Promise<ISession> {
    // Exclude read-only properties from being overridden directly
    const { sessionId: _, createdAt, updatedAt, ...safeUpdates } = stateUpdates;
    
    return this.sessionRepository.update(sessionId, safeUpdates);
  }

  public async getSession(sessionId: SessionId): Promise<ISession> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} not found`);
    }
    return session;
  }

  private async updateSessionStatus(sessionId: SessionId, status: SessionStatus): Promise<ISession> {
    const updated = await this.sessionRepository.update(sessionId, { status });
    logger.info({ sessionId, status }, 'Interview session status changed');
    return updated;
  }
}
