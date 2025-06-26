import { NextRequest, NextResponse } from 'next/server';
import { createTask, TaskType } from '@/lib/mongodb/tasks';
import { createExecution } from '@/lib/mongodb/executions';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    
    const { taskId, agentId, status, transactionHash, reasoning } = await req.json();


    // create agent
    const task = await createExecution({
      taskId: taskId,
      agentId: agentId,
      status: status,
      reasoning: reasoning,
      transactionHash: transactionHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ 
      task,
      status: 'success' 
    }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
