import { Collection, ObjectId } from 'mongodb';
import { connectToDatabase, getDatabase } from './connection';

export interface Execution {
  _id?: ObjectId;
  taskId: ObjectId;
  agentId: ObjectId;
  status: 'success' | 'failed' | 'pending';
  reasoning?: string | null;
  transactionHash?: string | null;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

let executionsCollection: Collection<Execution>;

async function getCollection() {
  // Always ensure database is connected
  await connectToDatabase();
  
  if (!executionsCollection) {
    const db = getDatabase();
    executionsCollection = db.collection<Execution>('executions');
    
    // Create indexes
    await executionsCollection.createIndex({ taskId: 1 });
    await executionsCollection.createIndex({ agentId: 1 });
    await executionsCollection.createIndex({ status: 1 });
  }
  return executionsCollection;
}

export async function createExecution(execution: Omit<Execution, '_id'>): Promise<Execution> {
  await connectToDatabase();
  const collection = await getCollection();
  const result = await collection.insertOne(execution);
  return { ...execution, _id: result.insertedId };
}

export async function updateExecution(
  executionId: ObjectId,
  update: Partial<Execution>
): Promise<Execution | null> {
  await connectToDatabase();
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: executionId },
    { $set: update },
    { returnDocument: 'after' }
  );
  return result;
}

export async function getTaskExecutions(
  taskId: ObjectId,
  limit: number = 10,
  skip: number = 0
): Promise<Execution[]> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection
    .find({ taskId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

export async function getAgentExecutions(
  agentId: ObjectId,
  limit: number = 10,
  skip: number = 0
): Promise<Execution[]> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection
    .find({ agentId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

export async function getPendingExecutions(): Promise<Execution[]> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.find({ status: 'pending' }).toArray();
}

export async function getExecutionById(executionId: ObjectId): Promise<Execution | null> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.findOne({ _id: executionId });
} 

// get all executions ordered by next execution time
export async function getExecutionsOrderedByNextExecutionTime(): Promise<Execution[]> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.find({}).sort({ nextExecutionTime: 1 }).toArray();
}