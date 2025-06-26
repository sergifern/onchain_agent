
/// echeck if user waitlist...

import { NextResponse, NextRequest } from 'next/server';
import { verifyUserAuth } from '@/lib/privy/users';
import { deployContract } from 'viem/actions';
import { createAgent, findOrCreateAgent, getAgentsByUserId } from '@/lib/mongodb/agents';
import { cookies } from 'next/headers';


export async function GET(req: NextRequest) {
  try {

    const user = await verifyUserAuth(req)


    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('user', user)
    const agent = await getAgentsByUserId(user as string)
    console.log('agent', agent)

    return NextResponse.json({ 
      agent,
      status: 'success'
    }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('body', body.agent.walletAddress)

    if (!body.agent.walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    const user = await verifyUserAuth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }


    // create agent
    const agent = await createAgent({
      userId: user as string,
      type: 'base',
      address: body.agent.walletAddress,
      status: 'active',
    });

    //WAIT OF 5 SECONDS
    await new Promise(resolve => setTimeout(resolve, 5000));

    return NextResponse.json({ 
      agent,
      status: 'success' 
    }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
