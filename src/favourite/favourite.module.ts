import { Module } from '@nestjs/common';
import { FavouriteController } from './favourite.controller';
import { FavouriteService } from './favourite.service';
import { ResponseBuilderModule } from '../responseBuilder/responseBuilder.module';
import { ProductModule } from '../product/product.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ResponseBuilderModule,
    FavouriteModule,
    ProductModule,
    PrismaModule,
  ],
  controllers: [FavouriteController],
  providers: [FavouriteService],
})
export class FavouriteModule {}
