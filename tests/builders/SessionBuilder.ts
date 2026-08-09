import { IInterviewSession } from '../../src/modules/database/DatabaseTypes';
import { v4 as uuidv4 } from 'uuid';

export class SessionBuilder {
  private session: IInterviewSession;

  constructor() {
    this.session = {
      id: uuidv4(),
      candidateId: uuidv4(),
      status: 'in_progress',
      metadata: {},
      startTime: new Date()
    };
  }

  public withId(id: string): this {
    this.session.id = id;
    return this;
  }

  public withCandidateId(candidateId: string): this {
    this.session.candidateId = candidateId;
    return this;
  }

  public withStatus(status: 'pending' | 'in_progress' | 'completed' | 'cancelled'): this {
    this.session.status = status;
    return this;
  }

  public build(): IInterviewSession {
    return { ...this.session };
  }
}
