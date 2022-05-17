import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration, environmentTypes } from './config/configuration';
import { ValidationPipe } from './pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (configuration.server.environment === environmentTypes.Development) {
    app.enableCors({
      origin: function (origin, callback) {
        const whitelist = ['http://localhost:4444', undefined];
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    });
  }

  app.useGlobalPipes(new ValidationPipe());

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // swagger options
  const options = new DocumentBuilder()
    .setTitle('Kidnance api')
    .setDescription('The Kidnance API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(configuration.server.port, () => {
    console.log(
      `API: http://${configuration.server.host}:${configuration.server.port}`,
    );
  });
}
bootstrap();
