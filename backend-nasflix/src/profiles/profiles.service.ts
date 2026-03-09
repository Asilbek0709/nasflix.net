import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfiles(userId: string) {
    return this.prisma.profile.findMany({
      where: { userId },
    });
  }

  async updateAvatar(userId: string, profileId: string, avatarPath: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.userId !== userId) {
      throw new ForbiddenException('You cannot update this profile');
    }

    // Удаляем старый аватар если есть
    if (profile.avatar) {
      const oldPath = path.join(process.cwd(), profile.avatar);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    return this.prisma.profile.update({
      where: { id: profileId },
      data: {
        avatar: avatarPath,
      },
    });
  }
}
