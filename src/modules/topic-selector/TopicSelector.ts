import { ITopicSelector } from './TopicSelectorInterfaces';
import { ITopicSelectorParams, ITopicSelectorResult, TopicSelectionMode, ITopicSelectionContext } from './TopicSelectorTypes';
import { AdaptiveStrategyEngine } from './helpers/AdaptiveStrategyEngine';
import { DependencyResolver } from './helpers/DependencyResolver';
import { DifficultyPolicy } from './helpers/DifficultyPolicy';
import { logger } from '../../utils/logger';

export class TopicSelector implements ITopicSelector {
  
  public selectNextTopic(params: ITopicSelectorParams | ITopicSelectionContext): ITopicSelectorResult {
    // Standardize params to new Context format or fallback for backwards compatibility
    const context = this.normalizeContext(params);
    const { curriculumTopics, topicState } = context;
    
    const remaining = [...topicState.remainingTopics];
    const completed = [...topicState.completedTopics];
    const history = [...topicState.topicHistory];

    // Handle curriculum completion
    if (remaining.length === 0 && history.length > 0) {
      return this.buildTerminalResult(context, 'All topics have been covered');
    }

    // Filter duplicates
    const available = remaining.filter(id => !completed.includes(id));
    if (available.length === 0) {
      return this.buildTerminalResult(context, 'All eligible topics have been covered');
    }

    // Filter by Dependencies
    const eligibleTopics = DependencyResolver.getEligibleTopics(
      curriculumTopics.filter(t => available.includes(t.id)),
      context
    );

    const selectable = eligibleTopics.length > 0 ? eligibleTopics : curriculumTopics.filter(t => available.includes(t.id));

    let selectedTopicObj = selectable[0];
    let reason = 'Sequential fallback';
    let priorityScore = 0;
    let performanceClassification = undefined;

    // Execute Adaptive Selection Strategy
    const scoredTopics = AdaptiveStrategyEngine.scoreTopics(selectable, context);
    
    if (scoredTopics.length > 0) {
      // Sort descending by priority score
      scoredTopics.sort((a, b) => b.score - a.score);
      selectedTopicObj = scoredTopics[0].topic;
      priorityScore = scoredTopics[0].score;
      
      const perfRec = topicState.performanceRecord?.[selectedTopicObj.id];
      if (perfRec) {
        performanceClassification = AdaptiveStrategyEngine.classifyPerformance(perfRec, context);
      }
      
      reason = `Adaptive Selection (${context.adaptiveStrategy}): Highest scored topic`;
    }

    // Evaluate Difficulty Policy based on recent history
    const recentClassifications = history.map(id => {
      const p = topicState.performanceRecord?.[id];
      return p ? AdaptiveStrategyEngine.classifyPerformance(p, context) : undefined;
    }).filter(c => c !== undefined) as any[];

    const nextDifficulty = DifficultyPolicy.calculateNextDifficulty(context, recentClassifications);

    // Prepare immutable state update
    const newRemaining = remaining.filter(id => id !== selectedTopicObj.id);
    if (history[history.length - 1] !== selectedTopicObj.id) {
      history.push(selectedTopicObj.id);
    }

    logger.debug({ 
      selectedTopicId: selectedTopicObj.id, 
      adaptiveStrategy: context.adaptiveStrategy, 
      nextDifficulty, 
      priorityScore,
      reason 
    }, 'Topic intelligently selected');

    return {
      selectedTopic: selectedTopicObj,
      difficulty: nextDifficulty,
      reason,
      priorityScore,
      performanceClassification,
      strategy: context.adaptiveStrategy,
      updatedTopicState: {
        ...topicState,
        completedTopics: completed,
        currentTopic: selectedTopicObj.id,
        topicHistory: history,
        remainingTopics: newRemaining,
      }
    };
  }

  private buildTerminalResult(context: ITopicSelectionContext, reason: string): ITopicSelectorResult {
    return {
      selectedTopic: null,
      difficulty: context.currentDifficulty,
      reason,
      updatedTopicState: { ...context.topicState }
    };
  }

  private normalizeContext(params: any): ITopicSelectionContext {
    // If it's already a context (has config), return it
    if (params.config) return params as ITopicSelectionContext;

    // Otherwise wrap old params (backward compatibility logic)
    const oldParams = params as ITopicSelectorParams;
    return {
      candidateProfile: {},
      curriculumTopics: oldParams.curriculumTopics,
      topicState: oldParams.topicState,
      interviewPhase: 'MIDDLE',
      remainingTimeMinutes: 60,
      adaptiveStrategy: (oldParams as any).adaptiveStrategy || 'BALANCED',
      currentDifficulty: oldParams.currentDifficulty,
      config: {} as any
    };
  }
}
