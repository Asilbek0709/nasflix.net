import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
  return this.prisma.user.findUnique({
    where: { id },
    include: {
      profiles: {
        include: {
          favorites: true,
          history: true,
          ratings: true
        }
      },
      subscription: true
    }
  })
}

  async getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profiles: true,
      },
    });
  }

  async create(data: {
    email: string;
    name?: string;
    password?: string;
    avatar?: string;
    provider?: string;
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  async updateAvatar(userId: string, avatar: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar },
    });
  }
}
