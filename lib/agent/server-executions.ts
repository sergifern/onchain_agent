import { PrivyClient } from "@privy-io/server-auth";
import { ethers, Interface, JsonFragment, toQuantity } from "ethers";
import { createPublicClient } from "viem";
import { http } from "viem";
import { base } from "viem/chains";
import { createExecution, Execution } from "../mongodb/executions";
import { Task, updateTask } from "../mongodb/tasks";
import { ObjectId } from "mongodb";

const publicClient = createPublicClient({ 
  chain: base,
  transport: http()
})

const chainId = 8453;

// Router and token addresses
const ROUTER_ADDRESS = "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24"; // BaseSwap Router (V2)
const UNIVERSAL_ROUTER_ADDRESS = "0x198EF79F1F515F02dFE9e3115eD9fC07183f02fC"; // Universal Router V4 on Base
const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3"; // Permit2 contract
const ETHY_ADDRESS = "0xC44141a684f6AA4E36cD9264ab55550B03C88643"; // Add your ETHY token address here
const VIRTUALS_ADDRESS = "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b";

// ABI for ERC20 (minimum for token approvals)
const ERC20_ABI = [
  "function approve(address spender, uint amount) public returns (bool)",
  "function allowance(address owner, address spender) view returns (uint)",
  "function balanceOf(address account) external view returns (uint)"
];

// ABI for Uniswap V2 Router
const ROUTER_ABI = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
];

// ABI for Universal Router V4
const UNIVERSAL_ROUTER_ABI = [
  {
    inputs: [
      { internalType: "bytes", name: "commands", type: "bytes" },
      { internalType: "bytes[]", name: "inputs", type: "bytes[]" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

// ABI for Permit2
const PERMIT2_ABI = [
  "function approve(address token, address spender, uint160 amount, uint48 expiration) external",
  "function allowance(address owner, address token, address spender) external view returns (uint160 amount, uint48 expiration, uint48 nonce)",
];

// Uniswap V4 Pool Manager address on Base
const POOL_MANAGER_ADDRESS = "0x7Da1D65F8B249183667cdE74C5CBD46dD38AA829"; // V4 Pool Manager on Base

export async function sendTransaction(walletId: string, txParams: any) {
  const privy = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID!, process.env.PRIVY_SECRET!, {
    walletApi: {
      authorizationPrivateKey: process.env.PRIVY_AUTH_KEY!
    }
  });

  const { hash } = await privy.walletApi.ethereum.sendTransaction({
    walletId: walletId,
    chainType: "ethereum",
    caip2: `eip155:${chainId}`,
    transaction: txParams as any,
  });
  return publicClient.waitForTransactionReceipt({ hash: hash as `0x${string}` });
}

export async function checkTokenAllowance(
  userAddress: string, 
  tokenAddress: string, 
  spenderAddress: string
): Promise<bigint> {
  // Validate input parameters
  if (!userAddress || !tokenAddress || !spenderAddress) {
    throw new Error(`Invalid parameters: userAddress=${userAddress}, tokenAddress=${tokenAddress}, spenderAddress=${spenderAddress}`);
  }

  const tokenInterface = new Interface(ERC20_ABI);
  const data = tokenInterface.encodeFunctionData("allowance", [userAddress, spenderAddress]);
  
  const result = await publicClient.call({
    to: tokenAddress as `0x${string}`,
    data: data as `0x${string}`
  });
  
  if (result.data) {
    return BigInt(result.data);
  }
  return 0n;
}

export async function approveToken(
  walletId: string,
  tokenAddress: string,
  spenderAddress: string,
  amount: bigint
) {
  // Validate input parameters
  if (!walletId || !tokenAddress || !spenderAddress) {
    throw new Error(`Invalid parameters: walletId=${walletId}, tokenAddress=${tokenAddress}, spenderAddress=${spenderAddress}`);
  }

  const tokenInterface = new Interface(ERC20_ABI);
  const data = tokenInterface.encodeFunctionData("approve", [spenderAddress, amount.toString()]);
  
  const txParams = {
    to: tokenAddress,
    data: data,
    value: "0x0",
    gasLimit: "0x15F90", // 90000
  };
  
  return await sendTransaction(walletId, txParams);
}

export async function ensureTokenAllowance(
  walletId: string,
  walletAddress: string,
  tokenAddress: string,
  spenderAddress: string,
  requiredAmount: bigint = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
) {
  // Validate input parameters
  if (!walletId || !walletAddress || !tokenAddress || !spenderAddress) {
    throw new Error(`Invalid parameters: walletId=${walletId}, walletAddress=${walletAddress}, tokenAddress=${tokenAddress}, spenderAddress=${spenderAddress}`);
  }

  const currentAllowance = await checkTokenAllowance(walletAddress, tokenAddress, spenderAddress);
  
  if (currentAllowance < requiredAmount) {
    // If current allowance is > 0 but less than required, reset to 0 first (for some tokens like USDT)
    if (currentAllowance > 0n) {
      await approveToken(walletId, tokenAddress, spenderAddress, 0n);
    }
    
    // Approve the required amount (or max uint256 for unlimited approval)
    const maxUint256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    await approveToken(walletId, tokenAddress, spenderAddress, maxUint256);
  }
}

export async function executeSwap(
  walletId: string,
  userAddress: string,
  tokenIn: string,
  tokenOut: string,
  amountIn: bigint,
  slippagePercent: number = 5 // Default 5% slippage
) {
  // Validate input parameters
  if (!walletId || !userAddress || !tokenIn || !tokenOut || amountIn <= 0n) {
    throw new Error(`Invalid parameters: walletId=${walletId}, userAddress=${userAddress}, tokenIn=${tokenIn}, tokenOut=${tokenOut}, amountIn=${amountIn}`);
  }

  // Build the swap path (direct swap between two tokens)
  const path = [tokenIn, tokenOut];

  // Set deadline to 20 minutes from now (reasonable default)
  const deadline = Math.floor(Date.now() / 1000) + (20 * 60);

  // Calculate minimum output with slippage protection
  // For simplicity, we'll set amountOutMin to 0 and let the user handle slippage
  // In production, you'd want to fetch the expected output and apply slippage
  const amountOutMin = 0n; // Accept any amount of output tokens
  
  // Ensure token approval for the input token
  await ensureTokenAllowance(walletId, userAddress, tokenIn, ROUTER_ADDRESS, amountIn);
  
  const routerInterface = new Interface(ROUTER_ABI);
  let data: string;
  
  // Use fee-on-transfer function if input token is ETHY
  if (tokenIn.toLowerCase() === VIRTUALS_ADDRESS.toLowerCase()) {
    console.log("swapExactTokensForTokens************************")
    data = routerInterface.encodeFunctionData("swapExactTokensForTokens", [
    amountIn.toString(),
    amountOutMin.toString(),
    path,
    userAddress,
    deadline
  ]);
} else {
    data = routerInterface.encodeFunctionData("swapExactTokensForTokensSupportingFeeOnTransferTokens", [
    amountIn.toString(),
    amountOutMin.toString(),
    path,
    userAddress,
    deadline
  ]);
  }
  
  const txParams = {
    to: ROUTER_ADDRESS,
    data: data,
    value: "0x0",
    gasLimit: "0x493E0", // 300000
  };
  
  return await sendTransaction(walletId, txParams);
}

// Helper function for common ETHY swaps
export async function swapEthy(
  walletId: string,
  userAddress: string,
  targetToken: string,
  amountIn: bigint
) {
  return await executeSwap(walletId, userAddress, ETHY_ADDRESS, targetToken, amountIn);
}

// Helper function to swap any token to ETHY
export async function swapToEthy(
  walletId: string,
  userAddress: string,
  sourceToken: string,
  amountIn: bigint
) {
  return await executeSwap(walletId, userAddress, sourceToken, ETHY_ADDRESS, amountIn);
}

// Simplified V4 swap using Pool Manager directly
export async function executeSwapV4(
  walletId: string,
  userAddress: string,
  tokenIn: string,
  tokenOut: string,
  amountIn: bigint,
  fee: number = 500, // Default 0.05% fee tier
  slippagePercent: number = 5
) {
  // For now, let's fall back to a more reliable approach
  // The Universal Router V4 implementation is complex and needs proper SDK integration
  console.log('V4 swap requested, but falling back to V2 for reliability');
  
  // Use the reliable V2 swap instead
  return await executeSwap(walletId, userAddress, tokenIn, tokenOut, amountIn, slippagePercent);
}

// Alternative: Create a simple V3 swap function which is more reliable than V4
export async function executeSwapV3(
  walletId: string,
  userAddress: string,
  tokenIn: string,
  tokenOut: string,
  amountIn: bigint,
  fee: number = 500,
  slippagePercent: number = 5
) {
  // Validate input parameters
  if (!walletId || !userAddress || !tokenIn || !tokenOut || amountIn <= 0n) {
    throw new Error(`Invalid parameters: walletId=${walletId}, userAddress=${userAddress}, tokenIn=${tokenIn}, tokenOut=${tokenOut}, amountIn=${amountIn}`);
  }

  // Uniswap V3 Router address on Base
  const V3_ROUTER_ADDRESS = "0x2626664c2603336E57B271c5C0b26F421741e481"; // SwapRouter02 on Base
  
  const deadline = Math.floor(Date.now() / 1000) + 1200; // 20 minutes
  const amountOutMin = 0n; // Accept any amount

  // Ensure token approval for V3 router
  await ensureTokenAllowance(walletId, userAddress, tokenIn, V3_ROUTER_ADDRESS, amountIn);

  // V3 Router ABI for exactInputSingle
  const V3_ROUTER_ABI = [
    "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)"
  ];

  const v3RouterInterface = new Interface(V3_ROUTER_ABI);
  
  const exactInputSingleParams = {
    tokenIn: tokenIn,
    tokenOut: tokenOut,
    fee: fee,
    recipient: userAddress,
    deadline: deadline,
    amountIn: amountIn.toString(),
    amountOutMinimum: amountOutMin.toString(),
    sqrtPriceLimitX96: 0 // No price limit
  };

  const data = v3RouterInterface.encodeFunctionData("exactInputSingle", [exactInputSingleParams]);

  const txParams = {
    to: V3_ROUTER_ADDRESS,
    data: data,
    value: tokenIn.toLowerCase() === "0x0000000000000000000000000000000000000000" ? `0x${amountIn.toString(16)}` : "0x0",
    gasLimit: "0x493E0", // 300000
  };

  return await sendTransaction(walletId, txParams);
}

export async function getTokenBalance(userAddress: string, tokenAddress: string): Promise<bigint> {
  // Validate input parameters
  if (!userAddress || !tokenAddress) {
    throw new Error(`Invalid parameters: userAddress=${userAddress}, tokenAddress=${tokenAddress}`);
  }

  const tokenInterface = new Interface(ERC20_ABI);
  const data = tokenInterface.encodeFunctionData("balanceOf", [userAddress]);
  
  const result = await publicClient.call({
    to: tokenAddress as `0x${string}`,
    data: data as `0x${string}`
  });
  
  if (result.data) {
    return BigInt(result.data);
  }
  return 0n;
}

// get wallet id from user
export async function getWalletIdFromUserId(userId: string) {
  const privy = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID!, process.env.PRIVY_SECRET!);
  const user = await privy.getUserById(userId);

  // Find the embedded Privy wallet in linkedAccounts where:
  // - type is 'wallet'
  // - chainType is 'ethereum' 
  // - walletClientType is 'privy'
  // - connectorType is 'embedded'
  const embeddedWallet = user.linkedAccounts.find(account => 
    account.type === 'wallet' &&
    account.chainType === 'ethereum' &&
    account.walletClientType === 'privy' &&
    account.connectorType === 'embedded'
  );

  if (!embeddedWallet) {
    throw new Error(`No embedded Privy wallet found for user ${userId}`);
  }

  // Use walletId property instead of id
  const walletId = (embeddedWallet as any).walletId || (embeddedWallet as any).address;
  if (!walletId) {
    throw new Error(`Embedded wallet found but has no wallet ID for user ${userId}`);
  }

  return walletId;
}

// Calculate next execution time based on frequency and scheduled time
export function calculateNextExecutionTime(
  frequency: string,
  scheduledTime: string | Date,
  currentNextExecutionTime?: Date
): Date {
  const now = new Date();
  let nextExecution = new Date(now);

  switch (frequency) {
    case '5m':
      // Add 5 minutes to current time
      nextExecution.setMinutes(nextExecution.getMinutes() + 5);
      break;

    case '15m':
      // Add 15 minutes to current time
      nextExecution.setMinutes(nextExecution.getMinutes() + 15);
      break;

    case '30m':
      // Add 30 minutes to current time
      nextExecution.setMinutes(nextExecution.getMinutes() + 30);
      break;

    case '1h':
      // Add 1 hour to current time
      nextExecution.setHours(nextExecution.getHours() + 1);
      break;

    case '4h':
      // Add 4 hours to current time
      nextExecution.setHours(nextExecution.getHours() + 4);
      break;

    case '12h':
      // Add 12 hours to current time
      nextExecution.setHours(nextExecution.getHours() + 12);
      break;

    case 'daily':
      // For daily tasks, use the hour from scheduledTime
      if (typeof scheduledTime === 'string') {
        // Parse time string (e.g., "14:30" or "2:30 PM")
        const timeParts = scheduledTime.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
        if (timeParts) {
          let hour = parseInt(timeParts[1]);
          const minute = parseInt(timeParts[2]);
          const ampm = timeParts[3];
          
          // Convert to 24-hour format if needed
          if (ampm) {
            if (ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
            if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
          }
          
          nextExecution.setHours(hour, minute, 0, 0);
        } else {
          // If can't parse, default to same time tomorrow
          nextExecution.setDate(nextExecution.getDate() + 1);
        }
      } else if (scheduledTime instanceof Date) {
        nextExecution.setHours(scheduledTime.getHours(), scheduledTime.getMinutes(), 0, 0);
      } else {
        // No scheduled time provided, just add 24 hours
        nextExecution.setDate(nextExecution.getDate() + 1);
      }
      
      // If the scheduled time today has passed, schedule for tomorrow
      if (nextExecution <= now) {
        nextExecution.setDate(nextExecution.getDate() + 1);
      }
      break;
      
    default:
      // Default to 1 hour if frequency is not recognized
      console.warn(`Unknown frequency: ${frequency}, defaulting to 1 hour`);
      nextExecution.setHours(nextExecution.getHours() + 1);
  }

  return nextExecution;
}

// function that receiving one execution (all object) and walletid, do som logic (we can leave it empey) and gets the transaction hash to create then and exeuction on the db with it
export async function executeTask(task: Task, walletId: string, agentId: ObjectId) {
  // do som logic
  // get the transaction hash
  // create the execution on the db with it, with the transaction hash
  // return the transaction hash

  //first update the task with the next execution time
  const nextExecutionTime = calculateNextExecutionTime(
    task.frequency, 
    task.scheduledTime || new Date(), 
    task.nextExecutionTime
  );
  const currentExecutionTime = new Date();
  
  await updateTask(task._id as ObjectId, { lastExecutionTime: currentExecutionTime, nextExecutionTime: nextExecutionTime });
  
  
  try {


    // EXECUTE THE TASK HERE




    const execution = await createExecution({
      taskId: task._id as ObjectId,
      status: 'success',
      agentId: agentId,
      reasoning: undefined,
      transactionHash: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error("Error executing task:", error);

    // Create a failed execution record
    const execution = await createExecution({
      taskId: task._id as ObjectId,
      agentId: new ObjectId(), // Placeholder agentId - replace with actual agent ID when available
      status: 'failed',
      reasoning: undefined,
      transactionHash: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return false;
  }
}
  