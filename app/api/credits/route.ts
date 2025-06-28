import { ensureTokenAllowance, getTokenBalance, executeSwap, executeSwapV4, executeSwapV3, swapEthy, getWalletIdFromUserId, executeTask } from "@/lib/agent/server-executions";
import { executeOneInchSwap, getOneInchQuote, test1inchAPI } from "@/lib/agent/oneinch-swap";
import { NextResponse } from "next/server";
import { getTasksOrderedByNextExecutionTime } from "@/lib/mongodb/tasks";
import { getAgentsByUserId, getAgentByUserId } from "@/lib/mongodb/agents";
import { ObjectId } from "mongodb";
import { createCredit } from "@/lib/mongodb/credits";



export async function POST(request: Request) {

  const { userId, amount } = await request.json();

  await createCredit({
    userId: userId,
    amount: amount,
    type: 'bonus',
    description: 'Initial bonus 50 agents',
  });

  return NextResponse.json({ 
    success: true, 
    message: 'Credit created successfully!',
  });
}

