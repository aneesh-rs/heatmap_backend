// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as swaggerUi from 'swagger-ui-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin:
      process.env.FRONTEND_URL || 'https://heatmap-api-integration.vercel.app/',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Heatmap API')
    .setDescription('Backend API for Heatmap project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Serve Swagger JSON
  app.use('/api/docs-json', (req, res) => res.json(document));

  // Serve Swagger UI via swagger-ui-express
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(document, {
      swaggerOptions: {
        url: '/api/docs-json', // point Swagger UI to the JSON route
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
