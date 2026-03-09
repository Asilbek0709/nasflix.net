import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MyListService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyList(userId: string): Promise<string[]> {
    const entries = await this.prisma.myListEntry.findMany({
      where: { userId },
      select: { movieId: true },
    });
    return entries.map((e) => e.movieId);
  }

  async add(userId: string, movieId: string) {
    await this.prisma.myListEntry.upsert({
      where: {
        userId_movieId: { userId, movieId },
      },
      create: { userId, movieId },
      update: {},
    });
    return { added: true };
  }

  async remove(userId: string, movieId: string) {
    await this.prisma.myListEntry.deleteMany({
      where: { userId, movieId },
    });
    return { removed: true };
  }

  async has(userId: string, movieId: string): Promise<boolean> {
    const entry = await this.prisma.myListEntry.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });
    return !!entry;
  }
}
