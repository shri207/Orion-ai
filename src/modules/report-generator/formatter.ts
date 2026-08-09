import { IReportCandidateInfo, IReportScores, IReportTopicBreakdown } from './types';

export class ReportFormatter {
  public formatCandidateInfo(session: any, profile: any): IReportCandidateInfo {
    return {
      name: profile?.name || 'Unknown',
      role: profile?.role || 'Unknown',
      experience: profile?.experience || 'Unknown',
      interviewDate: session?.startTime ? new Date(session.startTime).toISOString() : new Date().toISOString(),
      durationMinutes: session?.durationMinutes || 0
    };
  }

  public formatScores(rubricScores: any, skillMatrix: any, communicationMetrics: any): IReportScores {
    return {
      technical: rubricScores?.technical || 0,
      communication: communicationMetrics?.overallScore || 0,
      problemSolving: rubricScores?.problemSolving || 0,
      confidence: rubricScores?.confidence || 0,
      overall: rubricScores?.overall || 0
    };
  }

  public formatTopicBreakdown(questionHistory: any[], aiEvaluations: any[]): IReportTopicBreakdown[] {
    const topicsMap = new Map<string, any>();
    
    questionHistory.forEach((q, index) => {
      const topic = q.topic || 'General';
      if (!topicsMap.has(topic)) {
        topicsMap.set(topic, { questionsAsked: 0, totalScore: 0, totalAccuracy: 0, count: 0, notes: [] });
      }
      
      const topicData = topicsMap.get(topic);
      topicData.questionsAsked += 1;
      
      const evaluation = aiEvaluations.find(e => e.questionId === q.id);
      if (evaluation) {
        topicData.totalScore += evaluation.score || 0;
        topicData.totalAccuracy += evaluation.accuracy || 0;
        topicData.count += 1;
        if (evaluation.notes) {
          topicData.notes.push(evaluation.notes);
        }
      }
    });

    const breakdown: IReportTopicBreakdown[] = [];
    topicsMap.forEach((data, topic) => {
      breakdown.push({
        topic,
        questionsAsked: data.questionsAsked,
        score: data.count > 0 ? data.totalScore / data.count : 0,
        accuracy: data.count > 0 ? data.totalAccuracy / data.count : 0,
        notes: data.notes.join('; ')
      });
    });

    return breakdown;
  }
}
