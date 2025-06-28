import { NextResponse } from 'next/server';
import { connectToDatabase, getDatabase } from '@/lib/mongodb/connection';

export async function GET() {
  try {
    await connectToDatabase();
    const db = getDatabase();
    
    // Count total agents
    const agentsCollection = db.collection('agents');
    const totalAgents = await agentsCollection.countDocuments();
    
    // Count total executions
    const executionsCollection = db.collection('executions');
    const totalExecutions = await executionsCollection.countDocuments();
    
    // Mock ETHY credits used (as requested)
    const ethyCreditsUsed = "-";

    return NextResponse.json({
      totalAgents,
      totalExecutions,
      ethyCreditsUsed,
      status: 'success'
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      totalAgents: 0,
      totalExecutions: 0,
      ethyCreditsUsed: "-"
    }, { status: 500 });
  }
} 