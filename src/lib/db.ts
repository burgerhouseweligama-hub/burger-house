import mongoose from 'mongoose';
import { seedAdmin } from './seedAdmin';
import { seedMockData } from './seedMockData';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {

  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    // Attempt seeding in background on subsequent connections/hot reloads if needed, 
    // but typically we mainly care about the initial connection.
    // However, in dev mode with HMR, cached.conn persists.
    // We can rely on the internal checks of seed functions to avoid duplicate work.
    seedAdmin();
    seedMockData();
    return cached.conn;
  }


  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;

    // Seed data on connection
    seedAdmin();
    seedMockData();
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
