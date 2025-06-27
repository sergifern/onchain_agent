import { Collection, ObjectId } from 'mongodb';
import { connectToDatabase, getDatabase } from './connection';

export interface Credits {
  _id?: ObjectId;
  userId: string;
  amount: number;
  type: 'referral' | 'bonus' | 'fee';
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let creditsCollection: Collection<Credits>;

async function getCollection() {
  // Always ensure database is connected
  await connectToDatabase();
  
  if (!creditsCollection) {
    const db = getDatabase();
    creditsCollection = db.collection<Credits>('credits');
  }

  // Create indexes
  await creditsCollection.createIndex({ userId: 1 });
  await creditsCollection.createIndex({ _id: 1 });
  await creditsCollection.createIndex({ type: 1 });
  await creditsCollection.createIndex({ createdAt: -1 });

  return creditsCollection;
}

export async function createCredit(credit: Omit<Credits, '_id' | 'createdAt' | 'updatedAt'>): Promise<Credits> {
  await connectToDatabase();
  const collection = await getCollection();
  const now = new Date();
  const creditWithTimestamps = {
    ...credit,
    createdAt: now,
    updatedAt: now
  };
  const result = await collection.insertOne(creditWithTimestamps);
  return { ...creditWithTimestamps, _id: result.insertedId };
}

export async function getCreditsByUserId(userId: string): Promise<Credits[]> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.find({ userId }).sort({ createdAt: -1 }).toArray();
}

export async function getCreditById(creditId: ObjectId): Promise<Credits | null> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.findOne({ _id: creditId });
}

export async function getTotalCreditsByUserId(userId: string): Promise<number> {
  await connectToDatabase();
  const collection = await getCollection();
  const result = await collection.aggregate([
    { $match: { userId } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]).toArray();
  
  return result.length > 0 ? result[0].total : 0;
}

export async function getCreditsByUserIdAndType(userId: string, type: Credits['type']): Promise<Credits[]> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.find({ userId, type }).sort({ createdAt: -1 }).toArray();
}

export async function getTotalCreditsByUserIdAndType(userId: string, type: Credits['type']): Promise<number> {
  await connectToDatabase();
  const collection = await getCollection();
  const result = await collection.aggregate([
    { $match: { userId, type } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]).toArray();
  
  return result.length > 0 ? result[0].total : 0;
}

export async function updateCredit(creditId: ObjectId, update: Partial<Omit<Credits, '_id' | 'createdAt'>>): Promise<Credits | null> {
  await connectToDatabase();
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: creditId },
    { $set: { ...update, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result;
}

export async function deleteCredit(creditId: ObjectId): Promise<boolean> {
  await connectToDatabase();
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: creditId });
  return result.deletedCount > 0;
}

export async function getRecentCredits(userId: string, limit: number = 10): Promise<Credits[]> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.find({ userId }).sort({ createdAt: -1 }).limit(limit).toArray();
}

export async function getAllCredits(): Promise<Credits[]> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.find({}).sort({ createdAt: -1 }).toArray();
}

