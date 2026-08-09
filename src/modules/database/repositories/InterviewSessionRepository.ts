import { IInterviewSession, IInterviewSessionRepository } from '../DatabaseTypes';
import { DatabaseClient } from '../PrismaClient';

export class InterviewSessionRepository implements IInterviewSessionRepository {
  private prisma = DatabaseClient.getInstance();

  public async findById(id: string): Promise<IInterviewSession | null> {
    const session = await this.prisma.interview.findUnique({ where: { id } });
    if (!session) return null;

    return {
      id: session.id,
      candidateId: session.candidateId,
      status: session.status as IInterviewSession['status'],
      startTime: session.startedAt || undefined,
      endTime: session.endedAt || undefined,
      metadata: { currentQuestionIndex: session.currentQuestionIndex, currentTopic: session.currentTopic, difficulty: session.difficulty }
    };
  }

  public async findAll(filter?: Record<string, any>): Promise<IInterviewSession[]> {
    const where: any = {};
    if (filter?.status) where.status = filter.status;

    const sessions = await this.prisma.interview.findMany({ where });
    return sessions.map(session => ({
      id: session.id,
      candidateId: session.candidateId,
      status: session.status as IInterviewSession['status'],
      startTime: session.startedAt || undefined,
      endTime: session.endedAt || undefined,
      metadata: { currentQuestionIndex: session.currentQuestionIndex, currentTopic: session.currentTopic, difficulty: session.difficulty }
    }));
  }

  public async create(item: Omit<IInterviewSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<IInterviewSession> {
    const session = await this.prisma.$transaction(async (tx) => {
      return await tx.interview.create({
        data: {
          candidateId: item.candidateId,
          status: item.status,
          startedAt: item.startTime,
          endedAt: item.endTime,
          currentQuestionIndex: item.metadata?.currentQuestionIndex || 0,
          currentTopic: item.metadata?.currentTopic,
          difficulty: item.metadata?.difficulty
        }
      });
    });

    return {
      id: session.id,
      candidateId: session.candidateId,
      status: session.status as IInterviewSession['status'],
      startTime: session.startedAt || undefined,
      endTime: session.endedAt || undefined,
      metadata: { currentQuestionIndex: session.currentQuestionIndex, currentTopic: session.currentTopic, difficulty: session.difficulty }
    };
  }

  public async update(id: string, item: Partial<IInterviewSession>): Promise<IInterviewSession | null> {
    try {
      const data: any = {};
      if (item.status) data.status = item.status;
      if (item.startTime !== undefined) data.startedAt = item.startTime;
      if (item.endTime !== undefined) data.endedAt = item.endTime;
      if (item.metadata) {
        if (item.metadata.currentQuestionIndex !== undefined) data.currentQuestionIndex = item.metadata.currentQuestionIndex;
        if (item.metadata.currentTopic !== undefined) data.currentTopic = item.metadata.currentTopic;
        if (item.metadata.difficulty !== undefined) data.difficulty = item.metadata.difficulty;
      }

      const session = await this.prisma.$transaction(async (tx) => {
        return await tx.interview.update({
          where: { id },
          data
        });
      });

      return {
        id: session.id,
        candidateId: session.candidateId,
        status: session.status as IInterviewSession['status'],
        startTime: session.startedAt || undefined,
        endTime: session.endedAt || undefined,
        metadata: { currentQuestionIndex: session.currentQuestionIndex, currentTopic: session.currentTopic, difficulty: session.difficulty }
      };
    } catch (e: any) {
      if (e.code === 'P2025') return null;
      throw e;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.interview.delete({ where: { id } });
      return true;
    } catch (e: any) {
      if (e.code === 'P2025') return false;
      throw e;
    }
  }

  public async findByCandidateId(candidateId: string): Promise<IInterviewSession[]> {
    const sessions = await this.prisma.interview.findMany({ where: { candidateId } });
    return sessions.map(session => ({
      id: session.id,
      candidateId: session.candidateId,
      status: session.status as IInterviewSession['status'],
      startTime: session.startedAt || undefined,
      endTime: session.endedAt || undefined,
      metadata: { currentQuestionIndex: session.currentQuestionIndex, currentTopic: session.currentTopic, difficulty: session.difficulty }
    }));
  }
}
