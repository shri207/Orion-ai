export interface IInterviewBlueprint {
  durationMinutes: number;
  difficulty: string;
  codingRound: boolean;
  systemDesignRound: boolean;
  behavioralRound: boolean;
}

export interface ITopicRecommendation {
  topic: string;
  importance: number;
  difficulty: string;
  questionCount: number;
}
