import { ICandidateProfile, ICandidateProfileRepository } from '../DatabaseTypes';
import { DatabaseClient } from '../PrismaClient';

export class CandidateProfileRepository implements ICandidateProfileRepository {
  private prisma = DatabaseClient.getInstance();

  public async findById(id: string): Promise<ICandidateProfile | null> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
      include: { user: true }
    });
    
    if (!candidate) return null;

    return {
      id: candidate.id,
      name: candidate.user.name,
      email: candidate.user.email,
      role: candidate.role,
      experienceLevel: candidate.experienceLevel,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt
    };
  }

  public async findAll(filter?: Record<string, any>): Promise<ICandidateProfile[]> {
    const where: any = {};
    if (filter?.role) {
      where.role = filter.role;
    }

    const candidates = await this.prisma.candidate.findMany({
      where,
      include: { user: true }
    });

    return candidates.map(candidate => ({
      id: candidate.id,
      name: candidate.user.name,
      email: candidate.user.email,
      role: candidate.role,
      experienceLevel: candidate.experienceLevel,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt
    }));
  }

  public async create(item: Omit<ICandidateProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ICandidateProfile> {
    let user = await this.prisma.user.findUnique({ where: { email: item.email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { name: item.name, email: item.email }
      });
    }

    const candidate = await this.prisma.candidate.create({
      data: {
        userId: user.id,
        role: item.role,
        experienceLevel: item.experienceLevel
      },
      include: { user: true }
    });

    return {
      id: candidate.id,
      name: candidate.user.name,
      email: candidate.user.email,
      role: candidate.role,
      experienceLevel: candidate.experienceLevel,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt
    };
  }

  public async update(id: string, item: Partial<ICandidateProfile>): Promise<ICandidateProfile | null> {
    try {
      const candidate = await this.prisma.candidate.update({
        where: { id },
        data: {
          role: item.role,
          experienceLevel: item.experienceLevel
        },
        include: { user: true }
      });

      if (item.name || item.email) {
        await this.prisma.user.update({
          where: { id: candidate.userId },
          data: {
            name: item.name,
            email: item.email
          }
        });
        if (item.name) candidate.user.name = item.name;
        if (item.email) candidate.user.email = item.email;
      }

      return {
        id: candidate.id,
        name: candidate.user.name,
        email: candidate.user.email,
        role: candidate.role,
        experienceLevel: candidate.experienceLevel,
        createdAt: candidate.createdAt,
        updatedAt: candidate.updatedAt
      };
    } catch (e: any) {
      if (e.code === 'P2025') return null; 
      throw e;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.candidate.delete({ where: { id } });
      return true;
    } catch (e: any) {
      if (e.code === 'P2025') return false;
      throw e;
    }
  }

  public async findByEmail(email: string): Promise<ICandidateProfile | null> {
    const candidate = await this.prisma.candidate.findFirst({
      where: { user: { email } },
      include: { user: true }
    });

    if (!candidate) return null;

    return {
      id: candidate.id,
      name: candidate.user.name,
      email: candidate.user.email,
      role: candidate.role,
      experienceLevel: candidate.experienceLevel,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt
    };
  }
}
