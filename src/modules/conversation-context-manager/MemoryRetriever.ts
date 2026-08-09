import { IMemoryRetriever } from './ConversationContextInterfaces';
import { IRelevantMemory, IContextMessage } from './ConversationContextTypes';
import { IInterviewMemory } from '../interview-memory/InterviewMemoryInterfaces';

export class MemoryRetriever implements IMemoryRetriever {
  public retrieve(
    memory: IInterviewMemory, 
    currentTopic: string, 
    recentConversation: IContextMessage[], 
    limit: number
  ): IRelevantMemory[] {
    const relevantMemories: IRelevantMemory[] = [];
    
    const topicMistakes = memory.getMistakesByTopic(currentTopic);
    for (const mistake of topicMistakes) {
      relevantMemories.push({
        relevanceScore: 0.9 + (mistake.occurrences * 0.05),
        type: 'mistake',
        content: mistake
      });
    }

    const topicQuestions = memory.getQuestionsByTopic(currentTopic);
    for (const question of topicQuestions) {
      const answer = memory.getAnswerByQuestionId(question.id);
      relevantMemories.push({
        relevanceScore: 0.8,
        type: 'question',
        content: question
      });
      if (answer) {
        relevantMemories.push({
          relevanceScore: 0.8,
          type: 'answer',
          content: answer
        });
      }
    }

    const frequentMistakes = memory.getMostFrequentMistakes(2);
    for (const fm of frequentMistakes) {
      if (!relevantMemories.some(rm => rm.type === 'mistake' && rm.content.id === fm.id)) {
        relevantMemories.push({
          relevanceScore: 0.7,
          type: 'mistake',
          content: fm
        });
      }
    }

    return relevantMemories
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }
}
