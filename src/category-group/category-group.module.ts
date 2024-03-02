import { Module } from '@nestjs/common';
import { CategoryGroupController } from './category-group.controller';
import { CategoryGroupService } from './category-group.service';
import { PrismaService } from 'src/prisma.servcie';

@Module({
  controllers: [CategoryGroupController],
  providers: [CategoryGroupService,PrismaService]
})
export class CategoryGroupModule {}
