import { Collection, ObjectId } from 'mongodb';
import { connectToDatabase, getDatabase } from './connection';

export enum TaskType {
  BUY = 'buy',
  BUY_AND_STAKE = 'buy-and-stake',
  STAKE = 'stake',
  TRANSFER = 'transfer',
  SELL = 'sell',
}

export interface Asset {
  symbol: string;
  address: string;
  chain: string;
  decimals: number;
}

export interface Task {
  _id?: ObjectId;
  userId: string;
  name: string;
  condition: string; // prompt/condition text
  status: 'active' | 'inactive';
  type: TaskType;
  frequency: '5m' | '15m' | '30m' | '1h' | '4h' | '12h' | 'daily';
  scheduledTime?: Date; // UTC time for scheduled tasks (e.g., daily)
  amount: number;
  baseCurrency: Asset;
  asset: Asset;
  lastExecutionTime?: Date; // UTC, when the task was last executed
  nextExecutionTime?: Date; // UTC, when the task should next be executed
  isDeleted?: boolean; // Soft delete flag
  createdAt: Date;
  updatedAt: Date;
}

let tasksCollection: Collection<Task>;

async function getCollection() {
  // Always ensure database is connected
  await connectToDatabase();
  
  if (!tasksCollection) {
    const db = getDatabase();
    tasksCollection = db.collection<Task>('tasks');
  }

  // Create indexes
  await tasksCollection.createIndex({ _id: 1 });
  await tasksCollection.createIndex({ userId: 1 });
  await tasksCollection.createIndex({ agentId: 1 });
  return tasksCollection;
}

export async function findOrCreateTask(query: Partial<Task>, defaultData: Partial<Task>): Promise<Task> {
  await connectToDatabase();
  const collection = await getCollection();
  
  const result = await collection.findOne(query);
  if (result) {
    return result;
  }
  
  const newDoc = {
    ...defaultData,
    ...query,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Task;
  
  const insertResult = await collection.insertOne(newDoc);
  return { ...newDoc, _id: insertResult.insertedId };
}


export async function createTask(task: Task): Promise<Task> {
  await connectToDatabase();
  const collection = await getCollection();
  const now = new Date();
  const taskWithTimestamps = {
    ...task,
    createdAt: now,
    updatedAt: now
  };
  const result = await collection.insertOne(taskWithTimestamps);
  return { ...taskWithTimestamps, _id: result.insertedId };
}

export async function getTaskById(taskId: ObjectId): Promise<Task | null> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.findOne({ _id: taskId });
}

export async function updateTask(taskId: ObjectId, update: Partial<Task>): Promise<Task | null> {
  await connectToDatabase();
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: taskId },
    { $set: { ...update, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result;
}

export async function getActiveTasks(): Promise<Task[]> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.find({ status: 'active' }).toArray();
}

export async function getTasksByUserId(userId: string): Promise<Task[]> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.find({ userId }).toArray();
} 

export async function getTasksOrderedByNextExecutionTime(): Promise<Task[]> {
  await connectToDatabase();
  const collection = await getCollection();
  const currentTime = new Date();
  return collection.find({ 
    status: 'active',
    $or: [
      { isDeleted: { $exists: false } },
      { isDeleted: { $ne: true } }
    ],
    nextExecutionTime: { 
      $exists: true, 
      $type: "date",
      $lte: currentTime // Only tasks where execution time has passed
    } 
  }).sort({ nextExecutionTime: 1 }).toArray(); // Oldest (most overdue) first
}