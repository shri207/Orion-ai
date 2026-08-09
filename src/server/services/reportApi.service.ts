import { IReportDetails, IHistoryResponse, IPaginationOptions } from '../types/report.types';
import { Readable } from 'stream';

export interface IReportApiService {
  getReport(reportId: string): Promise<IReportDetails>;
  getReportPdfStream(reportId: string): Promise<Readable>;
  getCandidateHistory(candidateId: string, options: IPaginationOptions): Promise<IHistoryResponse>;
}

export class ReportApiService implements IReportApiService {
  public async getReport(reportId: string): Promise<IReportDetails> {
    if (!reportId) throw new Error('Report ID is required');
    
    return {
      reportId,
      candidateInfo: { name: 'John Doe', role: 'Backend Engineer' },
      metadata: { interviewDate: new Date().toISOString(), difficulty: 'Medium', type: 'Technical' },
      overallScore: 85,
      sectionScores: { Technical: 80, Communication: 90 },
      strengths: ['Problem Solving', 'Node.js'],
      weaknesses: ['Kubernetes'],
      summary: 'Strong candidate overall.',
      improvementPlan: { overview: { overallAssessment: 'Great' } },
      generatedAt: new Date().toISOString()
    };
  }

  public async getReportPdfStream(reportId: string): Promise<Readable> {
    if (!reportId) throw new Error('Report ID is required');
    
    const stream = new Readable();
    stream.push('Mock PDF Content');
    stream.push(null);
    return stream;
  }

  public async getCandidateHistory(candidateId: string, options: IPaginationOptions): Promise<IHistoryResponse> {
    if (!candidateId) throw new Error('Candidate ID is required');
    
    return {
      data: [
        {
          reportId: 'rep_123',
          interviewDate: new Date().toISOString(),
          role: 'Backend Engineer',
          difficulty: 'Medium',
          interviewType: 'Technical',
          overallScore: 85
        }
      ],
      total: 1,
      page: options.page || 1,
      limit: options.limit || 10
    };
  }
}
