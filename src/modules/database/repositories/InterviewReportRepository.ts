import { IInterviewReport, IInterviewReportRepository } from '../DatabaseTypes';
import { DatabaseClient } from '../PrismaClient';

export class InterviewReportRepository implements IInterviewReportRepository {
  private prisma = DatabaseClient.getInstance();

  public async findById(id: string): Promise<IInterviewReport | null> {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) return null;

    return {
      id: report.id,
      interviewId: report.interviewId,
      overallScore: report.overallScore,
      generatedAt: report.generatedAt,
      reportData: {
        summary: report.summary,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        recommendations: report.recommendations
      }
    };
  }

  public async findAll(filter?: Record<string, any>): Promise<IInterviewReport[]> {
    const reports = await this.prisma.report.findMany();
    return reports.map(report => ({
      id: report.id,
      interviewId: report.interviewId,
      overallScore: report.overallScore,
      generatedAt: report.generatedAt,
      reportData: {
        summary: report.summary,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        recommendations: report.recommendations
      }
    }));
  }

  public async create(item: Omit<IInterviewReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<IInterviewReport> {
    const report = await this.prisma.$transaction(async (tx) => {
      return await tx.report.create({
        data: {
          interviewId: item.interviewId,
          overallScore: item.overallScore,
          generatedAt: item.generatedAt || new Date(),
          summary: item.reportData?.summary || '',
          strengths: item.reportData?.strengths || [],
          weaknesses: item.reportData?.weaknesses || [],
          recommendations: item.reportData?.recommendations || []
        }
      });
    });

    return {
      id: report.id,
      interviewId: report.interviewId,
      overallScore: report.overallScore,
      generatedAt: report.generatedAt,
      reportData: {
        summary: report.summary,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        recommendations: report.recommendations
      }
    };
  }

  public async update(id: string, item: Partial<IInterviewReport>): Promise<IInterviewReport | null> {
    try {
      const data: any = {};
      if (item.overallScore !== undefined) data.overallScore = item.overallScore;
      if (item.generatedAt !== undefined) data.generatedAt = item.generatedAt;
      if (item.reportData) {
        if (item.reportData.summary !== undefined) data.summary = item.reportData.summary;
        if (item.reportData.strengths !== undefined) data.strengths = item.reportData.strengths;
        if (item.reportData.weaknesses !== undefined) data.weaknesses = item.reportData.weaknesses;
        if (item.reportData.recommendations !== undefined) data.recommendations = item.reportData.recommendations;
      }

      const report = await this.prisma.$transaction(async (tx) => {
        return await tx.report.update({
          where: { id },
          data
        });
      });

      return {
        id: report.id,
        interviewId: report.interviewId,
        overallScore: report.overallScore,
        generatedAt: report.generatedAt,
        reportData: {
          summary: report.summary,
          strengths: report.strengths,
          weaknesses: report.weaknesses,
          recommendations: report.recommendations
        }
      };
    } catch (e: any) {
      if (e.code === 'P2025') return null;
      throw e;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.report.delete({ where: { id } });
      return true;
    } catch (e: any) {
      if (e.code === 'P2025') return false;
      throw e;
    }
  }

  public async findByInterviewId(interviewId: string): Promise<IInterviewReport | null> {
    const report = await this.prisma.report.findFirst({ where: { interviewId } });
    if (!report) return null;

    return {
      id: report.id,
      interviewId: report.interviewId,
      overallScore: report.overallScore,
      generatedAt: report.generatedAt,
      reportData: {
        summary: report.summary,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        recommendations: report.recommendations
      }
    };
  }
}
