import { ITopicState } from '../topic-selector/TopicSelectorTypes';

export interface IInterviewStateStore {
    getTopicState(sessionId: string): Promise<ITopicState | null>;
    setTopicState(sessionId: string, state: ITopicState): Promise<void>;
    getHistory(sessionId: string): Promise<any[]>;
    appendHistory(sessionId: string, entry: any): Promise<void>;
    getSessionState(sessionId: string): Promise<any | null>;
    setSessionState(sessionId: string, state: any): Promise<void>;
    getCandidateState(sessionId: string): Promise<any | null>;
    setCandidateState(sessionId: string, candidate: any): Promise<void>;
    deleteSessionState(sessionId: string): Promise<void>;
    clear(sessionId: string): Promise<void>;
    shutdown(): Promise<void>;
    ping(): Promise<boolean>;
}
