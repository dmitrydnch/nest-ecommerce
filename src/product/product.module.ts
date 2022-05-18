import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ResponseBuilderModule } from '../responseBuilder/responseBuilder.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [ResponseBuilderModule, PrismaModule, CategoryModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
