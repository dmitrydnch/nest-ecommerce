import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ResponseBuilderModule } from '../responseBuilder/responseBuilder.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ResponseBuilderModule, PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
