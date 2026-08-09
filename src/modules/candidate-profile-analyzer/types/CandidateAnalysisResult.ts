import { z } from 'zod';
import { CandidateLevel } from './CandidateLevel';

export const SkillCategorySchema = z.object({
  languages: z.array(z.string()),
  frameworks: z.array(z.string()),
  databases: z.array(z.string()),
  cloud: z.array(z.string()),
  devops: z.array(z.string()),
  testing: z.array(z.string()),
  tools: z.array(z.string())
});

export const StrengthSchema = z.object({
  name: z.string(),
  confidence: z.number().min(0).max(1),
  evidence: z.array(z.string())
});

export const WeakAreaSchema = z.object({
  name: z.string(),
  reason: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'])
});

export const TopicRecommendationSchema = z.object({
  topic: z.string(),
  importance: z.number().min(1).max(10),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  questionCount: z.number().min(1)
});

export const InterviewBlueprintSchema = z.object({
  durationMinutes: z.number().min(15).max(240),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  codingRound: z.boolean(),
  systemDesignRound: z.boolean(),
  behavioralRound: z.boolean()
});

export const ProfileQualitySchema = z.object({
  score: z.number().min(0).max(100),
  missingSections: z.array(z.string())
});

export const CandidateLevelConfidenceSchema = z.object({
  value: z.nativeEnum(CandidateLevel),
  confidence: z.number().min(0).max(1)
});

export const CandidateAnalysisResultSchema = z.object({
  candidateLevel: CandidateLevelConfidenceSchema,
  estimatedExperienceYears: z.number().min(0),
  specialization: z.string(),
  profileQuality: ProfileQualitySchema,
  skills: SkillCategorySchema,
  strengths: z.array(StrengthSchema),
  weakAreas: z.array(WeakAreaSchema),
  recommendedTopics: z.array(TopicRecommendationSchema),
  interviewPlan: InterviewBlueprintSchema,
  summary: z.string(),
  reasoning: z.array(z.string())
});

export type ICandidateAnalysisResult = z.infer<typeof CandidateAnalysisResultSchema>;
export type ISkillCategory = z.infer<typeof SkillCategorySchema>;
export type IStrength = z.infer<typeof StrengthSchema>;
export type IWeakArea = z.infer<typeof WeakAreaSchema>;
export type IProfileQuality = z.infer<typeof ProfileQualitySchema>;
