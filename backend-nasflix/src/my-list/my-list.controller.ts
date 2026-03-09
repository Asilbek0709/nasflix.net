import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MyListService } from './my-list.service';

@Controller('my-list')
@UseGuards(JwtAuthGuard)
export class MyListController {
  constructor(private readonly myListService: MyListService) {}

  @Get()
  getMyList(@Req() req: any) {
    return this.myListService.getMyList(req.user.id);
  }

  @Post()
  add(@Req() req: any, @Body() body: { movieId: string }) {
    return this.myListService.add(req.user.id, String(body.movieId));
  }

  @Delete(':movieId')
  remove(@Req() req: any, @Param('movieId') movieId: string) {
    return this.myListService.remove(req.user.id, movieId);
  }

  @Get('has/:movieId')
  async has(@Req() req: any, @Param('movieId') movieId: string) {
    const inList = await this.myListService.has(req.user.id, movieId);
    return { inList };
  }
}
