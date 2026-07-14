import mongoose from 'mongoose';

let isConnected = false;

export async function connectDatabase(uri: string) {
  if (!uri) {
    throw new Error('MONGODB_URI is required');
  }

  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(uri);
  isConnected = true;
  return mongoose.connection;
}
