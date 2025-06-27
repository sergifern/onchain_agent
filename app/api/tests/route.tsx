import { ensureTokenAllowance, getTokenBalance, executeSwap, executeSwapV4, executeSwapV3, swapEthy, getWalletIdFromUserId, executeTask } from "@/lib/agent/server-executions";
import { executeOneInchSwap, getOneInchQuote, test1inchAPI } from "@/lib/agent/oneinch-swap";
import { NextResponse } from "next/server";
import { getTasksOrderedByNextExecutionTime } from "@/lib/mongodb/tasks";
import { getAgentsByUserId, getAgentByUserId } from "@/lib/mongodb/agents";
import { ObjectId } from "mongodb";
import { createCredit } from "@/lib/mongodb/credits";

export const maxDuration = 250; // This function can run for a maximum of 5 seconds


export async function GET(request: Request) {

  // Test swapping 100 ETHY tokens to USDC
  const amountToSwap = BigInt(Math.floor(100 * 1e18)); // 100 ETHY (18 decimals)


  try {
    

    const executions = await getTasksOrderedByNextExecutionTime();
    //console.log(executions);

    if (executions.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No tasks to execute'
      });
    }

    const firstTask = executions[0];
    console.log(firstTask);
    //console.log(firstTask.userId);

    const walletId = await getWalletIdFromUserId(firstTask.userId);
    console.log(walletId);

    const agent = await getAgentByUserId(firstTask.userId);
    //console.log(agent);

    if (agent) {
      const result = await executeTask(firstTask, walletId, agent.address, agent._id as ObjectId);
    } else {
      throw new Error("Agent not found");
    }
    

    return NextResponse.json({ 
      success: true, 
    });
  } catch (error) {
    console.error('Swap test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    });
  }
}