import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ResponseBuilderModule } from '../responseBuilder/responseBuilder.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from '../category/category.module';
import { FavouriteModule } from '../favourite/favourite.module';

@Module({
  imports: [
    ResponseBuilderModule,
    PrismaModule,
    CategoryModule,
    FavouriteModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
