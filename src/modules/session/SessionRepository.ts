import { ISession, ISessionRepository } from './SessionInterfaces';
import { SessionId } from './SessionTypes';
import { logger } from '../../utils/logger';

export class InMemorySessionRepository implements ISessionRepository {
  private sessions: Map<SessionId, ISession> = new Map();

  async save(session: ISession): Promise<string> {
    this.sessions.set(session.sessionId, { ...session });
    logger.debug({ sessionId: session.sessionId }, 'Session saved to repository');
    return session.sessionId;
  }

  async findById(sessionId: SessionId): Promise<ISession | null> {
    const session = this.sessions.get(sessionId);
    return session ? { ...session } : null;
  }

  async update(sessionId: SessionId, updates: Partial<ISession>): Promise<ISession> {
    const session = await this.findById(sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} not found.`);
    }

    const updatedSession: ISession = { 
      ...session, 
      ...updates, 
      updatedAt: new Date() 
    };
    
    this.sessions.set(sessionId, updatedSession);
    logger.debug({ sessionId }, 'Session updated in repository');
    return updatedSession;
  }

  async delete(sessionId: SessionId): Promise<void> {
    this.sessions.delete(sessionId);
    logger.debug({ sessionId }, 'Session deleted from repository');
  }
}
