import { CandidateAnalysisResultSchema, ICandidateAnalysisResult } from './types/CandidateAnalysisResult';
import { ZodError } from 'zod';
import { logger } from '../../utils/logger';

export class CandidateAnalysisParser {
  public static parse(content: string): ICandidateAnalysisResult {
    let rawJson: any;

    try {
      rawJson = JSON.parse(content);
    } catch (e) {
      // Attempt to extract JSON if markdown is used
      const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          rawJson = JSON.parse(jsonMatch[1]);
        } catch {
          throw new Error('CandidateAnalysisParser: Extracted JSON block is invalid');
        }
      } else {
        const bracketMatch = content.match(/(\{[\s\S]*\})/);
        if (bracketMatch && bracketMatch[1]) {
          try {
            rawJson = JSON.parse(bracketMatch[1]);
          } catch {
            throw new Error('CandidateAnalysisParser: Extracted bracket JSON is invalid');
          }
        } else {
          throw new Error('CandidateAnalysisParser: Could not parse JSON from LLM response');
        }
      }
    }

    return this.validateAndFix(rawJson);
  }

  private static validateAndFix(rawJson: any): ICandidateAnalysisResult {
    // Basic structural fixes for common LLM omissions
    if (!rawJson.skills) {
      rawJson.skills = { languages: [], frameworks: [], databases: [], cloud: [], devops: [], testing: [], tools: [] };
    }
    
    const skillCategories = ['languages', 'frameworks', 'databases', 'cloud', 'devops', 'testing', 'tools'];
    for (const cat of skillCategories) {
      if (!rawJson.skills[cat] || !Array.isArray(rawJson.skills[cat])) {
        rawJson.skills[cat] = [];
      }
    }

    if (!rawJson.strengths || !Array.isArray(rawJson.strengths)) rawJson.strengths = [];
    if (!rawJson.weakAreas || !Array.isArray(rawJson.weakAreas)) rawJson.weakAreas = [];
    if (!rawJson.recommendedTopics || !Array.isArray(rawJson.recommendedTopics)) rawJson.recommendedTopics = [];
    if (!rawJson.reasoning || !Array.isArray(rawJson.reasoning)) rawJson.reasoning = [];
    
    if (!rawJson.profileQuality) {
      rawJson.profileQuality = { score: 50, missingSections: [] };
    }

    try {
      return CandidateAnalysisResultSchema.parse(rawJson);
    } catch (error: any) {
      if (error instanceof ZodError) {
        logger.error({ error: error.format() }, 'CandidateAnalysisParser: Schema validation failed');
        throw new Error(`CandidateAnalysisParser: Invalid schema. ${error.message}`);
      }
      throw error;
    }
  }
}
