import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WatchProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string): Promise<{ movieId: string; progress: number }[]> {
    const list = await this.prisma.watchProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { movieId: true, progress: true },
    });
    return list;
  }

  async setProgress(userId: string, movieId: string, progress: number) {
    await this.prisma.watchProgress.upsert({
      where: {
        userId_movieId: { userId, movieId },
      },
      create: { userId, movieId, progress },
      update: { progress },
    });
    return { progress };
  }

  async getProgress(userId: string, movieId: string): Promise<number | null> {
    const row = await this.prisma.watchProgress.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });
    return row?.progress ?? null;
  }
}
