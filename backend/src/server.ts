import dotenv from 'dotenv';
import { connectDatabase } from './config/db';
import { createApp } from './app';

dotenv.config({ path: '.env.local' });
dotenv.config();

const port = Number(process.env.PORT || 4000);
const mongoUri = process.env.MONGODB_URI || '';

async function start() {
  await connectDatabase(mongoUri);

  const app = createApp();
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
