import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as winston from 'winston';
import { configuration } from './config/configuration';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './http-exception.filter';
import { JsonBodyMiddleware } from './middleware/json-body.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UrlencodedMiddleware } from './middleware/urlencoded.middleware';
import { ResponseBuilderModule } from './responseBuilder/responseBuilder.module';
import { WinstonModule } from 'nest-winston';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
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
