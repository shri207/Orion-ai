import { ICandidateProfileAnalyzer } from './ICandidateProfileAnalyzer';
import { ICandidateAnalysisResult } from './types/CandidateAnalysisResult';

export class CandidateProfileAnalyzerService {
  constructor(private readonly analyzer: ICandidateProfileAnalyzer) {}

  /**
   * Analyzes a candidate profile/resume.
   * Input can be a raw resume string or a stringified JSON profile.
   */
  public async analyze(profileInput: string): Promise<ICandidateAnalysisResult> {
    if (!profileInput || profileInput.trim() === '') {
      throw new Error('CandidateProfileAnalyzerService: Input cannot be empty');
    }

    // Pass the raw text or JSON string to the analyzer
    // The LLM prompt is instructed to handle both formats.
    return await this.analyzer.analyzeProfile({ profileText: profileInput });
  }
}
