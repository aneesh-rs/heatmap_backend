import express from 'express';
import { createApp } from './create-app';

const expressApp = express();
let bootstrapPromise: ReturnType<typeof createApp> | undefined;

export default async function handler(req: express.Request, res: express.Response) {
  try {
    if (!bootstrapPromise) {
      bootstrapPromise = createApp(expressApp);
    }

    await bootstrapPromise;
    expressApp(req, res);
  } catch (error) {
    bootstrapPromise = undefined;
    console.error('Serverless bootstrap failed:', error);

    if (!res.headersSent) {
      res.status(500).json({
        statusCode: 500,
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
}
