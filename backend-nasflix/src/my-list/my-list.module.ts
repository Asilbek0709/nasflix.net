import { Module } from '@nestjs/common';
import { MyListController } from './my-list.controller';
import { MyListService } from './my-list.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MyListController],
  providers: [MyListService],
  exports: [MyListService],
})
export class MyListModule {}
