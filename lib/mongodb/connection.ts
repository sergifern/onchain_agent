import { MongoClient, Db } from 'mongodb';

// MongoDB connection string - should be in environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB || 'data';

// MongoDB client instance
let client: MongoClient;
let db: Db;
let connectionPromise: Promise<{ db: Db; client: MongoClient }> | null = null;

// Connect to MongoDB
export async function connectToDatabase() {
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    if (!client) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db(DB_NAME);
    }
    return { db, client };
  })();

  return connectionPromise;
}

// Close database connection
export async function closeDatabase() {
  if (client) {
    await client.close();
    client = undefined as any;
    db = undefined as any;
    connectionPromise = null;
  }
}

// Get database instance
export function getDatabase() {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
} 