import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryController } from './category.controller';
import { ResponseBuilderModule } from '../responseBuilder/responseBuilder.module';

@Module({
  imports: [ResponseBuilderModule, PrismaModule],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
