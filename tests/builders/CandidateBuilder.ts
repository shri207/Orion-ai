import { ICandidateProfile } from '../../src/modules/database/DatabaseTypes';
import { v4 as uuidv4 } from 'uuid';

export class CandidateBuilder {
  private candidate: ICandidateProfile;

  constructor() {
    this.candidate = {
      id: uuidv4(),
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Software Engineer',
      experienceLevel: 'Mid-Level',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  public withId(id: string): this {
    this.candidate.id = id;
    return this;
  }

  public withName(name: string): this {
    this.candidate.name = name;
    return this;
  }

  public build(): ICandidateProfile {
    return { ...this.candidate };
  }
}
