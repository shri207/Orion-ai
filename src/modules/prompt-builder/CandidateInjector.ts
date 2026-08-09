import { ICandidateInjector } from './PromptBuilderInterfaces';

export class CandidateInjector implements ICandidateInjector {
  public inject(candidate: any): string {
    if (!candidate) return '';
    return `
Candidate Profile: ${candidate.profile || 'N/A'}
Experience Level: ${candidate.experienceLevel || 'N/A'}
Interview Role: ${candidate.interviewRole || 'N/A'}
Preferred Language: ${candidate.preferredLanguage || 'N/A'}
Strengths: ${candidate.strengths?.join(', ') || 'N/A'}
Weaknesses: ${candidate.weaknesses?.join(', ') || 'N/A'}
Previous Mistakes: ${candidate.previousMistakes?.join(', ') || 'N/A'}
Confidence Trend: ${candidate.confidenceTrend || 'N/A'}
    `.trim();
  }
}
