import { ensureTokenAllowance, getTokenBalance, executeSwap, executeSwapV4, executeSwapV3, swapEthy, getWalletIdFromUserId, executeTask } from "@/lib/agent/server-executions";
import { executeOneInchSwap, getOneInchQuote, test1inchAPI } from "@/lib/agent/oneinch-swap";
import { NextResponse } from "next/server";
import { getTasksOrderedByNextExecutionTime } from "@/lib/mongodb/tasks";
import { getAgentsByUserId, getAgentByUserId } from "@/lib/mongodb/agents";
import { ObjectId } from "mongodb";



const userAddress = "0xEFC124e58Fb2E5D67966E9141a63A3533C54cABB";
const ETHY_ADDRESS = "0xC44141a684f6AA4E36cD9264ab55550B03C88643";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // USDC on Base
const ROUTER_ADDRESS = "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24"; // Uniswap V2 Router
const VIRTUALS_ADDRESS = "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b";


export async function GET(request: Request) {

  // Test swapping 100 ETHY tokens to USDC
  const amountToSwap = BigInt(Math.floor(100 * 1e18)); // 100 ETHY (18 decimals)
  
  try {


    const executions = await getTasksOrderedByNextExecutionTime();
    //console.log(executions);
    const firstTask = executions[0];
    //console.log(firstTask);
    //console.log(firstTask.userId);

    const walletId = await getWalletIdFromUserId(firstTask.userId);
    //console.log(walletId);

    const agent = await getAgentByUserId(firstTask.userId);
    //console.log(agent);

    if (agent) {
      const result = await executeTask(firstTask, walletId, agent._id as ObjectId);
      //console.log(result);
    } else {
      throw new Error("Agent not found");
    }
    


    /*//console.log('Executing 1inch swap...');
    const swapResult = await executeOneInchSwap(
      'nhmx1a68751zaumphl7kefjs',
      userAddress,
      ETHY_ADDRESS,
      USDC_ADDRESS,
      amountToSwap
    );
        
    return NextResponse.json({ 
      success: true, 
      message: 'Swap completed successfully!',
      swapResult: swapResult.transactionHash
    });*/

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