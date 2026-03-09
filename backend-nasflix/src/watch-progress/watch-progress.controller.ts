import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WatchProgressService } from './watch-progress.service';

@Controller('watch-progress')
@UseGuards(JwtAuthGuard)
export class WatchProgressController {
  constructor(private readonly watchProgressService: WatchProgressService) {}

  @Get()
  getAll(@Req() req: any) {
    return this.watchProgressService.getAll(req.user.id);
  }

  @Post()
  setProgress(
    @Req() req: any,
    @Body() body: { movieId: string; progress: number },
  ) {
    return this.watchProgressService.setProgress(
      req.user.id,
      String(body.movieId),
      Number(body.progress) || 0,
    );
  }

  @Get(':movieId')
  async getProgress(@Req() req: any, @Param('movieId') movieId: string) {
    const progress = await this.watchProgressService.getProgress(
      req.user.id,
      movieId,
    );
    return { progress: progress ?? 0 };
  }
}
