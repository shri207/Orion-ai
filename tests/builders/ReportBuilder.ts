import { IInterviewReport } from '../../src/modules/database/DatabaseTypes';
import { v4 as uuidv4 } from 'uuid';

export class ReportBuilder {
  private report: IInterviewReport;

  constructor() {
    this.report = {
      id: uuidv4(),
      interviewId: uuidv4(),
      overallScore: 85,
      reportData: {
        summary: 'Good performance',
        strengths: ['Communication'],
        weaknesses: ['React Hooks'],
        recommendations: ['Practice custom hooks']
      },
      generatedAt: new Date()
    };
  }

  public withInterviewId(interviewId: string): this {
    this.report.interviewId = interviewId;
    return this;
  }

  public withScore(score: number): this {
    this.report.overallScore = score;
    return this;
  }

  public build(): IInterviewReport {
    return { ...this.report };
  }
}
