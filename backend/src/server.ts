import dotenv from 'dotenv';
import { connectDatabase } from './config/db';
import { createApp } from './app';

dotenv.config({ path: '.env.local' });
dotenv.config();

const port = Number(process.env.PORT || 4000);
const mongoUri = process.env.MONGODB_URI || '';

const app = createApp();

// 1. Establish the database connection globally (Serverless friendly)
if (mongoUri) {
  connectDatabase(mongoUri).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });
} else {
  console.warn('Warning: MONGODB_URI is not defined.');
}

// 2. ONLY run app.listen() if we are running locally, NOT on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

// 3. Export the app instance for Vercel's serverless handler
export default app;