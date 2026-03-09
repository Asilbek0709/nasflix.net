import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profiles: {
          create: {
            name: 'Main Profile',
            avatar: `https://ui-avatars.com/api/?name=${name}`,
          },
        },
      },
      include: { profiles: true },
    });

    await this.assignDefaultPlan(user.id);
    return this.issueTokens(user);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profiles: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueTokens(user);
  }

  async validateOAuthUser(data: {
    email: string;
    name: string;
    avatar?: string;
  }) {
    let user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: { profiles: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: null,
          profiles: {
            create: {
              name: 'Main Profile',
              avatar:
                data.avatar || `https://ui-avatars.com/api/?name=${data.name}`,
            },
          },
        },
        include: { profiles: true },
      });
      await this.assignDefaultPlan(user.id);
    }

    return this.issueTokens(user);
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profiles: true },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Logged out successfully' };
  }

  private async assignDefaultPlan(userId: string) {
    let plan = await this.prisma.plan.findFirst({
      where: { tier: 'basic' },
    });
    if (!plan) {
      plan = await this.prisma.plan.create({
        data: {
          name: 'Basic',
          tier: 'basic',
          price: 0,
          interval: 'MONTHLY',
        },
      });
    }
    await this.prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        status: 'ACTIVE',
      },
    });
  }

  private async issueTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwt.sign(payload, {
      expiresIn: '15m',
    });

    const refresh_token = this.jwt.sign(payload, {
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refresh_token, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    const { password, refreshToken, ...safeUser } = user;

    return {
      user: safeUser,
      access_token,
      refresh_token,
    };
  }
}
