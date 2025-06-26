import { Address } from 'viem';
import { Collection, ObjectId } from 'mongodb';
import { connectToDatabase, getDatabase } from './connection';

export interface Agent {
  _id?: ObjectId;
  userId: string;
  address: Address;
  type: 'base' | 'solana';
  status: 'active' | 'inactive';
}

let agentsCollection: Collection<Agent>;

async function getCollection() {
  // Always ensure database is connected
  await connectToDatabase();
  
  if (!agentsCollection) {
    const db = getDatabase();
    agentsCollection = db.collection<Agent>('agents');
  }

  // Create indexes
  await agentsCollection.createIndex({ userId: 1 });
  await agentsCollection.createIndex({ _id: 1 });

  return agentsCollection;
}


export async function createAgent(agent: Agent): Promise<Agent> {
  await connectToDatabase();
  const collection = await getCollection();
  const now = new Date();
  const agentWithTimestamps = {
    ...agent,
    createdAt: now,
    updatedAt: now
  };
  const result = await collection.insertOne(agentWithTimestamps);
  return { ...agentWithTimestamps, _id: result.insertedId };
}

export async function findOrCreateAgent(query: Partial<Agent>, defaultData: Partial<Agent>): Promise<Agent> {
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
  } as Agent;
  
  const insertResult = await collection.insertOne(newDoc);
  return { ...newDoc, _id: insertResult.insertedId };
}

export async function getAgentById(agentId: ObjectId): Promise<Agent | null> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.findOne({ _id: agentId });
}

export async function updateAgent(agentId: ObjectId, update: Partial<Agent>): Promise<Agent | null> {
  await connectToDatabase();
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: agentId },
    { $set: { ...update, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result;
}

export async function getActiveAgents(): Promise<Agent[]> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.find({ status: 'active' }).toArray();
}

export async function getAgentsByUserId(userId: string): Promise<Agent | null> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.findOne({ userId, status: 'active' });
}


export async function getAgentByUserId(userId: string): Promise<Agent | null> {
  await connectToDatabase();
  const collection = await getCollection();
  return collection.findOne({ userId, status: 'active' });
}


export async function getUserByAgentId(agentId: string): Promise<string | null> {
  await connectToDatabase();
  const collection = await getCollection();
  const agent = await collection.findOne({ _id: new ObjectId(agentId) });
  return agent?.userId || null;
}