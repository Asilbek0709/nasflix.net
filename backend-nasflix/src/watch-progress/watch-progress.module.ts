import { Module } from '@nestjs/common';
import { WatchProgressController } from './watch-progress.controller';
import { WatchProgressService } from './watch-progress.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WatchProgressController],
  providers: [WatchProgressService],
  exports: [WatchProgressService],
})
export class WatchProgressModule {}
