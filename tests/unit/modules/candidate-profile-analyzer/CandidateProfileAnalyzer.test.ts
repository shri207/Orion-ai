import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CandidateProfileAnalyzer } from '../../../../src/modules/candidate-profile-analyzer/CandidateProfileAnalyzer';
import { CandidateLevel } from '../../../../src/modules/candidate-profile-analyzer/types/CandidateLevel';
import { FakeLLMClient } from '../../../mocks/FakeLLMClient';

describe('CandidateProfileAnalyzer Unit Tests', () => {
  let llmClient: FakeLLMClient;
  let analyzer: CandidateProfileAnalyzer;

  beforeEach(() => {
    llmClient = new FakeLLMClient();
    analyzer = new CandidateProfileAnalyzer(llmClient);
  });

  const getMockedResponse = (level: CandidateLevel, topics: string[], missing: string[] = []) => {
    return JSON.stringify({
      candidateLevel: { value: level, confidence: 0.95 },
      estimatedExperienceYears: level === CandidateLevel.BEGINNER ? 0 : level === CandidateLevel.MID_LEVEL ? 3 : 6,
      specialization: 'Software Engineering',
      profileQuality: { score: 90, missingSections: missing },
      skills: {
        languages: ['Java'],
        frameworks: ['Spring'],
        databases: ['SQL'],
        cloud: [],
        devops: [],
        testing: [],
        tools: []
      },
      strengths: [{ name: 'Java', confidence: 0.9, evidence: ['Project X'] }],
      weakAreas: missing.length ? [{ name: 'Missing Info', reason: 'Incomplete resume', priority: 'HIGH' }] : [],
      recommendedTopics: topics.map(t => ({ topic: t, importance: 8, difficulty: 'MEDIUM', questionCount: 2 })),
      interviewPlan: {
        durationMinutes: 60,
        difficulty: 'MEDIUM',
        codingRound: true,
        systemDesignRound: level === CandidateLevel.SENIOR,
        behavioralRound: true
      },
      summary: 'Test summary',
      reasoning: ['Looks good']
    });
  };

  it('Profile 1: Fresh graduate should be Beginner with fundamental topics', async () => {
    vi.spyOn(llmClient, 'generateCompletion').mockResolvedValueOnce({
      content: getMockedResponse(CandidateLevel.BEGINNER, ['Data Structures', 'Algorithms', 'OOP']),
      model: 'test-model',
      usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 }
    });

    const result = await analyzer.analyzeProfile({ profileText: 'Recent BS CS Graduate. Projects in Java.' });
    expect(result.candidateLevel.value).toBe(CandidateLevel.BEGINNER);
    expect(result.recommendedTopics[0].topic).toBe('Data Structures');
    expect(result.interviewPlan.systemDesignRound).toBe(false);
  });

  it('Profile 2: 2-3 years Java Backend should be Mid-Level with Spring/SQL topics', async () => {
    vi.spyOn(llmClient, 'generateCompletion').mockResolvedValueOnce({
      content: getMockedResponse(CandidateLevel.MID_LEVEL, ['Spring Boot', 'SQL', 'REST']),
      model: 'test-model',
      usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 }
    });

    const result = await analyzer.analyzeProfile({ profileText: '2.5 years backend dev using Java Spring and MySQL.' });
    expect(result.candidateLevel.value).toBe(CandidateLevel.MID_LEVEL);
    expect(result.recommendedTopics[0].topic).toBe('Spring Boot');
    expect(result.estimatedExperienceYears).toBe(3);
  });

  it('Profile 3: Senior Full Stack should be Senior with System Design topics', async () => {
    vi.spyOn(llmClient, 'generateCompletion').mockResolvedValueOnce({
      content: getMockedResponse(CandidateLevel.SENIOR, ['System Design', 'Scalability', 'Leadership']),
      model: 'test-model',
      usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 }
    });

    const result = await analyzer.analyzeProfile({ profileText: '6 years experience, led architecture for 3 microservices.' });
    expect(result.candidateLevel.value).toBe(CandidateLevel.SENIOR);
    expect(result.interviewPlan.systemDesignRound).toBe(true);
    expect(result.recommendedTopics[1].topic).toBe('Scalability');
  });

  it('Profile 4: Data Scientist should focus on ML and Python', async () => {
    vi.spyOn(llmClient, 'generateCompletion').mockResolvedValueOnce({
      content: getMockedResponse(CandidateLevel.MID_LEVEL, ['Machine Learning', 'Python', 'Statistics']),
      model: 'test-model',
      usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 }
    });

    const result = await analyzer.analyzeProfile({ profileText: 'Data Scientist working with scikit-learn, Python, and pandas.' });
    expect(result.recommendedTopics[0].topic).toBe('Machine Learning');
    expect(result.recommendedTopics[1].topic).toBe('Python');
  });

  it('Profile 5: Incomplete Resume should degrade gracefully', async () => {
    vi.spyOn(llmClient, 'generateCompletion').mockResolvedValueOnce({
      content: getMockedResponse(CandidateLevel.BEGINNER, ['Fundamentals'], ['Projects', 'Experience']),
      model: 'test-model',
      usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 }
    });

    const result = await analyzer.analyzeProfile({ profileText: 'Just some text with no real structure' });
    expect(result.profileQuality.missingSections).toContain('Projects');
    expect(result.weakAreas[0].name).toBe('Missing Info');
    expect(result.weakAreas[0].priority).toBe('HIGH');
  });

  it('Should throw error on empty input', async () => {
    await expect(analyzer.analyzeProfile({ profileText: '   ' })).rejects.toThrow('CandidateProfileAnalyzer: Profile text is too short or empty.');
  });
});
