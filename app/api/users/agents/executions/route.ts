import { NextRequest, NextResponse } from 'next/server';
import { verifyUserAuth } from '@/lib/privy/users';
import { getAgentsByUserId } from '@/lib/mongodb/agents';
import { getAgentExecutions } from '@/lib/mongodb/executions';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyUserAuth(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get the user's agent (first agent)
    const agent = await getAgentsByUserId(user as string);
    
    console.log(agent);
    if (!agent) {
      return NextResponse.json({ error: 'No agent found for user' }, { status: 404 });
    }

    // Get executions for this agent
    const executions = await getAgentExecutions(agent._id as ObjectId, 50); // Get up to 50 executions

    console.log(executions);
    return NextResponse.json({ 
      executions,
      success: true
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching executions:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
