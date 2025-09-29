import { NestFactory } from '@nestjs/core';
import { AppModule } from '../dist/app.module';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Server } from 'http';

let cachedServer: Server;

async function bootstrapServer() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api');
  await app.init();
  return createServer((req: IncomingMessage, res: ServerResponse) => {
    app.getHttpAdapter().getInstance()(req, res);
  });
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  cachedServer.emit('request', req, res);
}
