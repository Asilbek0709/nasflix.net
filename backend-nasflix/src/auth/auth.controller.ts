import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { setAuthCookies } from './auth.utils';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard'; 
import { JwtService } from '@nestjs/jwt';
import { GithubAuthGuard } from './guards/github-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService, // 🔥 ВАЖНО
  ) {}

  @Post('register')
  async register(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(
      body.name,
      body.email,
      body.password,
    );

    setAuthCookies(res, tokens);

    return { user: tokens.user };
  }

  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(
      body.email,
      body.password,
    );

    setAuthCookies(res, tokens);

    return { user: tokens.user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return (req as any).user;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req: Request, @Res() res: Response) {
    const tokens = (req as any).user;

    setAuthCookies(res, tokens);

    return res.redirect(process.env.CLIENT_URL!);
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubRedirect(@Req() req: Request, @Res() res: Response) {
    const tokens = (req as any).user;

    setAuthCookies(res, tokens);

    return res.redirect(process.env.CLIENT_URL!);
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const payload = this.jwtService.verify(refreshToken);

    const tokens = await this.authService.refresh(
      payload.sub,
      refreshToken,
    );

    setAuthCookies(res, tokens);

    return { user: tokens.user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = (req as any).user;

    await this.authService.logout(user.id);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }
}