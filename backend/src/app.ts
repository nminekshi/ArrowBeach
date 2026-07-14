import cors from 'cors';
import express, { type Request, type Response, type NextFunction } from 'express';
import { reservationsRouter } from './routes/reservations';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(',').map((value) => value.trim()) ?? ['http://localhost:3000'],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok', service: 'arrow-beach-backend' });
  });

  app.use('/api/reservations', reservationsRouter);

  app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof SyntaxError && 'body' in error) {
      response.status(400).json({ message: 'Invalid JSON payload' });
      return;
    }

    if (error instanceof Error) {
      response.status(400).json({ message: error.message });
      return;
    }

    response.status(500).json({ message: 'Internal server error' });
  });

  return app;
}
