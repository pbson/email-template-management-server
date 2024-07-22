import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useLogger(app.get(Logger));
  app.use(json({ limit: '50mb' }));

  const configService = app.get(ConfigService<unknown, true>);

  if (configService.get<string>('app_env') !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Bumper Cars Core Service')
      .setDescription('The Bumper Cars Core Service API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}
bootstrap();
