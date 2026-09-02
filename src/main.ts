import { NestFactory } from '@nestjs/core';
import express from 'express';
import { createApp } from './create-app';

async function bootstrap() {
  const expressApp = express();
  const app = await createApp(expressApp);
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
