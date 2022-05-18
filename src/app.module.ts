import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as winston from 'winston';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import {
  AllExceptionsFilter,
  PrismaExceptionsFilter,
} from './http-exception.filter';
import { JsonBodyMiddleware } from './middleware/json-body.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UrlencodedMiddleware } from './middleware/urlencoded.middleware';
import { ResponseBuilderModule } from './responseBuilder/responseBuilder.module';
import { WinstonModule } from 'nest-winston';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { FavouriteModule } from './favourite/favourite.module';
import { CategoryModule } from './category/category.module';

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${JSON.stringify(message)}`;
});

let winstonTransports = [
  new winston.transports.Console({
    format: winston.format.combine(winston.format.timestamp(), myFormat),
  }),
  new winston.transports.File({
    filename: 'error.log',
    level: 'error',
    format: winston.format.combine(winston.format.timestamp(), myFormat),
  }),
  new winston.transports.File({
    filename: 'combined.log',
    format: winston.format.combine(winston.format.timestamp(), myFormat),
  }),
];

if (process.env.NODE_ENV === 'test') {
  winstonTransports = [
    new winston.transports.File({
      filename: 'combined.test.log',
      format: winston.format.combine(winston.format.timestamp(), myFormat),
    }),
  ];
}

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: winstonTransports,
    }),
    AuthModule,
    UsersModule,
    ResponseBuilderModule,
    PrismaModule,
    ProductModule,
    FavouriteModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JsonBodyMiddleware)
      .forRoutes('*')
      .apply(LoggerMiddleware)
      .forRoutes(AppController)
      .apply(UrlencodedMiddleware)
      .forRoutes(AppController);
  }
}
