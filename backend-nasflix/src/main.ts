import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  await app.listen(process.env.PORT || 5000);
}

bootstrap();
