import { IInterviewMemory } from './InterviewMemoryInterfaces';
import { 
  IMemoryQuestion, 
  IMemoryAnswer, 
  IMemoryMistake, 
  IMemoryContext, 
  IMemorySnapshot,
  MistakeCategory
} from './InterviewMemoryTypes';
import crypto from 'crypto';

export class InterviewMemoryService implements IInterviewMemory {
  private questions: Map<string, IMemoryQuestion> = new Map();
  private questionOrder: string[] = []; 
  
  private answers: Map<string, IMemoryAnswer> = new Map();
  private answerOrder: string[] = []; 
  
  private mistakes: Map<string, IMemoryMistake> = new Map();
  
  private context: IMemoryContext = {
    currentTopic: null,
    previousTopic: null,
    currentDifficulty: null,
    topicsCompleted: [],
    topicsSkipped: [],
    strongTopics: [],
    weakTopics: [],
    followUpChain: [],
    candidateConfidenceTrend: []
  };

  public addQuestion(question: Omit<IMemoryQuestion, 'askedAt'>): void {
    if (this.questions.has(question.id)) {
      throw new Error(`Question with ID ${question.id} already exists in memory.`);
    }
    const newQuestion: IMemoryQuestion = { ...question, askedAt: Date.now() };
    this.questions.set(question.id, newQuestion);
    this.questionOrder.push(question.id);
  }

  public hasQuestionBeenAsked(questionId: string): boolean {
    return this.questions.has(questionId);
  }

  public getQuestionsByTopic(topic: string): IMemoryQuestion[] {
    return this.getAllQuestions().filter(q => q.topic === topic);
  }

  public getQuestionsByDifficulty(difficulty: string): IMemoryQuestion[] {
    return this.getAllQuestions().filter(q => q.difficulty === difficulty);
  }

  public getAllQuestions(): IMemoryQuestion[] {
    return this.questionOrder.map(id => this.questions.get(id)!);
  }

  public addAnswer(answer: Omit<IMemoryAnswer, 'answeredAt'>): void {
    if (this.answers.has(answer.id)) {
      throw new Error(`Answer with ID ${answer.id} already exists in memory.`);
    }
    const newAnswer: IMemoryAnswer = { ...answer, answeredAt: Date.now() };
    this.answers.set(answer.id, newAnswer);
    this.answerOrder.push(answer.id);
  }

  public getAnswerByQuestionId(questionId: string): IMemoryAnswer | undefined {
    for (const [, answer] of this.answers) {
      if (answer.questionId === questionId) {
        return answer;
      }
    }
    return undefined;
  }

  public getRecentAnswers(limit: number): IMemoryAnswer[] {
    const ids = this.answerOrder.slice(-limit);
    return ids.map(id => this.answers.get(id)!);
  }

  public getAllAnswers(): IMemoryAnswer[] {
    return this.answerOrder.map(id => this.answers.get(id)!);
  }

  public recordMistake(description: string, category: MistakeCategory, topic: string): void {
    const mistakeId = crypto.createHash('md5').update(description.toLowerCase().trim()).digest('hex');
    const now = Date.now();

    if (this.mistakes.has(mistakeId)) {
      const existing = this.mistakes.get(mistakeId)!;
      existing.occurrences += 1;
      existing.lastObservedAt = now;
    } else {
      this.mistakes.set(mistakeId, {
        id: mistakeId,
        description,
        category,
        topic,
        occurrences: 1,
        firstObservedAt: now,
        lastObservedAt: now
      });
    }
  }

  public getMostFrequentMistakes(limit: number): IMemoryMistake[] {
    return Array.from(this.mistakes.values())
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, limit);
  }

  public getMistakesByTopic(topic: string): IMemoryMistake[] {
    return Array.from(this.mistakes.values())
      .filter(m => m.topic === topic)
      .sort((a, b) => b.lastObservedAt - a.lastObservedAt);
  }

  public getLatestMistake(): IMemoryMistake | undefined {
    const all = Array.from(this.mistakes.values());
    if (all.length === 0) return undefined;
    return all.reduce((latest, current) => current.lastObservedAt > latest.lastObservedAt ? current : latest);
  }

  public getMistakeFrequency(description: string): number {
    const mistakeId = crypto.createHash('md5').update(description.toLowerCase().trim()).digest('hex');
    return this.mistakes.get(mistakeId)?.occurrences || 0;
  }

  public getAllMistakes(): IMemoryMistake[] {
    return Array.from(this.mistakes.values()).sort((a, b) => b.lastObservedAt - a.lastObservedAt);
  }

  public updateContext(updates: Partial<IMemoryContext>): void {
    this.context = {
      ...this.context,
      ...updates
    };
  }

  public getContext(): IMemoryContext {
    return { ...this.context };
  }

  public getSnapshot(): IMemorySnapshot {
    return {
      questions: this.getAllQuestions(),
      answers: this.getAllAnswers(),
      mistakes: this.getAllMistakes(),
      context: this.getContext()
    };
  }

  public clear(): void {
    this.questions.clear();
    this.questionOrder = [];
    this.answers.clear();
    this.answerOrder = [];
    this.mistakes.clear();
    this.context = {
      currentTopic: null,
      previousTopic: null,
      currentDifficulty: null,
      topicsCompleted: [],
      topicsSkipped: [],
      strongTopics: [],
      weakTopics: [],
      followUpChain: [],
      candidateConfidenceTrend: []
    };
  }
}
