import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Express } from 'express';
import { AppModule } from './app.module';

function assertServerlessEnv(): void {
  if (!process.env.VERCEL) {
    return;
  }

  const required = ['MONGODB_URI', 'JWT_SECRET'] as const;
  const missing = required.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables on Vercel: ${missing.join(', ')}`,
    );
  }
}

export async function createApp(expressApp: Express): Promise<INestApplication> {
  assertServerlessEnv();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  const corsOrigins = [
    'https://heatmap-api-integration.vercel.app',
    'http://localhost:5173',
    ...(process.env.FRONTEND_URL || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  ];

  app.enableCors({
    origin: [...new Set(corsOrigins)],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Heatmap API')
    .setDescription('Backend API for Heatmap project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, documentFactory, {
    customSiteTitle: 'Heatmap API Documentation',
  });

  await app.init();
  return app;
}
