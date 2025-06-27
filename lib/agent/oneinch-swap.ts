/**
 * 1inch Swap Integration for Base Network
 * 
 * Required Environment Variables:
 * - ONEINCH_API_KEY: Your 1inch API key from https://portal.1inch.dev/
 * - NEXT_PUBLIC_PRIVY_APP_ID: Privy app ID
 * - PRIVY_SECRET: Privy secret key
 * - PRIVY_AUTH_KEY: Privy authorization private key
 * 
 * Usage:
 * - executeOneInchSwap(): Main function to swap tokens using 1inch
 * - getOneInchQuote(): Get price quote before swapping
 * - checkOneInchAllowance(): Check if token approval is needed
 */

import { PrivyClient } from "@privy-io/server-auth";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { sendTransaction } from "./server-executions";

const publicClient = createPublicClient({
  chain: base,
  transport: http()
});

const chainId = 8453; // Base chain ID
const apiBaseUrl = `https://api.1inch.dev/swap/v6.0/${chainId}`;
const broadcastApiUrl = `https://api.1inch.dev/tx-gateway/v1.1/${chainId}/broadcast`;

// 1inch API headers
const headers = {
  'Authorization': `Bearer ${process.env.ONEINCH_API_KEY}`,
  'accept': 'application/json',
  'Content-Type': 'application/json'
};

// Rate limiting variables
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

// Validate required environment variables
const requiredEnvVars = {
  ONEINCH_API_KEY: process.env.ONEINCH_API_KEY,
  NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  PRIVY_SECRET: process.env.PRIVY_SECRET,
  PRIVY_AUTH_KEY: process.env.PRIVY_AUTH_KEY
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.warn(`Warning: ${key} environment variable is not set`);
  }
});

// Rate limiting helper
async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    //console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

// Enhanced fetch with retry logic for rate limiting
async function fetchWithRetry(url: string, options: any, maxRetries: number = 3): Promise<Response> {
  await waitForRateLimit();
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // If rate limited, wait and retry
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000; // Exponential backoff
        
        //console.log(`Rate limited (attempt ${attempt}/${maxRetries}). Waiting ${waitTime}ms before retry...`);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      
      return response;
    } catch (error) {
      console.error(`Request attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying on network errors
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw new Error('Max retries exceeded');
}

interface SwapParams {
  src: string;       // Source token address
  dst: string;       // Destination token address
  amount: string;    // Amount to swap (in wei)
  from: string;      // Wallet address
  slippage: number;  // Slippage percentage (e.g., 1 for 1%)
  disableEstimate?: boolean;
  allowPartialFill?: boolean;
}

// Construct full API request URL
function apiRequestUrl(methodName: string, queryParams: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  return `${apiBaseUrl}${methodName}?${params.toString()}`;
}

// Check token allowance for 1inch router
export async function checkOneInchAllowance(
  tokenAddress: string,
  walletAddress: string
): Promise<string> {
  const url = apiRequestUrl('/approve/allowance', {
    tokenAddress,
    walletAddress
  });

  try {
    const response = await fetchWithRetry(url, { headers });
    
    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`1inch API error (${response.status}):`, errorText);
      throw new Error(`1inch API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.allowance || '0';
  } catch (error) {
    console.error('Error checking allowance:', error);
    return '0';
  }
}

// Build approval transaction for 1inch router
export async function buildApprovalTransaction(
  tokenAddress: string,
  amount?: string
): Promise<any> {
  const url = apiRequestUrl('/approve/transaction', 
    amount ? { tokenAddress, amount } : { tokenAddress }
  );

  //console.log('1inch approval URL:', url);
  //console.log('1inch headers:', headers);

  try {
    const response = await fetch(url, { headers });
    
    // Check response status and content type
    //console.log('Response status:', response.status);
    //console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`1inch API error (${response.status}):`, errorText);
      throw new Error(`1inch API error: ${response.status} - ${errorText}`);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('Non-JSON response:', responseText);
      throw new Error(`Expected JSON response, got: ${contentType}`);
    }
    
    const transaction = await response.json();
    
    if (transaction.error) {
      throw new Error(`1inch API error: ${transaction.description || transaction.error}`);
    }
    
    //console.log('Raw 1inch approval transaction:', JSON.stringify(transaction, null, 2));
    
    return transaction;
  } catch (error) {
    console.error('Error building approval transaction:', error);
    throw error;
  }
}

// Build swap transaction using 1inch
export async function buildSwapTransaction(swapParams: SwapParams): Promise<any> {
  const url = apiRequestUrl('/swap', swapParams);

  //console.log('1inch swap URL:', url);

  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`1inch API error (${response.status}):`, errorText);
      throw new Error(`1inch API error: ${response.status} - ${errorText}`);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('Non-JSON response:', responseText);
      throw new Error(`Expected JSON response, got: ${contentType}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`1inch API error: ${data.description || data.error}`);
    }
    
    return data.tx;
  } catch (error) {
    console.error('Error building swap transaction:', error);
    throw error;
  }
}

// Direct transaction sending without problematic gas parameters
async function sendSimpleTransaction(walletId: string, to: string, data: string, value: string = '0x0') {
  console.log('process.env.PRIVY_AUTH_KEY*************', process.env.PRIVY_AUTH_KEY!);
  const privy = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID!, process.env.PRIVY_SECRET!, {
    walletApi: {
      authorizationPrivateKey: process.env.PRIVY_AUTH_KEY!
    }
  });

  const simpleTx = {
    to: to,
    data: data.startsWith('0x') ? data : `0x${data}`,
    value: value.startsWith('0x') ? value : `0x${value}`,
    gasLimit: "0x7A120", // 500000 - generous gas limit
  };

  //console.log('Simple transaction params:', simpleTx);

  const { hash } = await privy.walletApi.ethereum.sendTransaction({
    walletId: walletId,
    chainType: "ethereum",
    caip2: `eip155:${chainId}`,
    transaction: simpleTx as any,
  });
  
  return publicClient.waitForTransactionReceipt({ hash: hash as `0x${string}` });
}

// Simplified 1inch swap that avoids formatting issues
export async function executeSimple1inchSwap(
  walletId: string,
  userAddress: string,
  tokenIn: string,
  tokenOut: string,
  amountIn: bigint,
  slippagePercent: number = 1
) {
  //console.log('Starting simplified 1inch swap...');
  
  try {
    // Step 1: Get approval transaction
    await sleep(1000);
    const approvalTx = await buildApprovalTransaction(tokenIn);
    //console.log('Approval tx from 1inch:', approvalTx);
    
    // Send simple approval
    await sendSimpleTransaction(walletId, approvalTx.to, approvalTx.data);
    //console.log('Approval completed');
    
    // Step 2: Build swap
    await sleep(2000);
    const swapParams: SwapParams = {
      src: tokenIn,
      dst: tokenOut,
      amount: amountIn.toString(),
      from: userAddress,
      slippage: slippagePercent,
      disableEstimate: false,
      allowPartialFill: false
    };
    
    const swapTx = await buildSwapTransaction(swapParams);
    //console.log('Swap tx from 1inch:', swapTx);
    
    // Send simple swap
    const receipt = await sendSimpleTransaction(walletId, swapTx.to, swapTx.data, swapTx.value || '0x0');
    //console.log('Swap completed:', receipt.transactionHash);
    
    return receipt;
    
  } catch (error) {
    console.error('Simple 1inch swap failed:', error);
    throw error;
  }
}

// Simple sleep function
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Convert 1inch transaction parameters to Privy-compatible format
function convertToPrivyFormat(tx: any): any {
  const converted: any = {
    to: tx.to,
    data: tx.data, // Already has 0x prefix
  };

  // Convert value from decimal string to hex
  if (tx.value !== undefined) {
    const valueNum = parseInt(tx.value);
    converted.value = `0x${valueNum.toString(16)}`;
  } else {
    converted.value = '0x0';
  }

  // Convert gasPrice from decimal string to hex (if provided)
  if (tx.gasPrice) {
    const gasPriceNum = parseInt(tx.gasPrice);
    converted.gasPrice = `0x${gasPriceNum.toString(16)}`;
  }

  // Convert gas from decimal string to hex (if provided)
  if (tx.gas) {
    const gasNum = parseInt(tx.gas);
    converted.gasLimit = `0x${gasNum.toString(16)}`;
  }

  // Convert gasLimit from decimal string to hex (if provided)
  if (tx.gasLimit) {
    const gasLimitNum = parseInt(tx.gasLimit);
    converted.gasLimit = `0x${gasLimitNum.toString(16)}`;
  }

  return converted;
}

// Utility function to ensure hex values have 0x prefix
function ensureHexPrefix(value: any): string {
  if (value === null || value === undefined) return '0x0';
  const str = String(value);
  return str.startsWith('0x') ? str : `0x${str}`;
}

// Clean up 1inch transaction parameters for Privy compatibility
function cleanupTxParams(txParams: any): any {
  const cleaned = {
    to: txParams.to,
    data: ensureHexPrefix(txParams.data),
    value: ensureHexPrefix(txParams.value || '0'),
  };

  // Add gas parameters if they exist
  if (txParams.gas) cleaned.gasLimit = ensureHexPrefix(txParams.gas);
  if (txParams.gasLimit) cleaned.gasLimit = ensureHexPrefix(txParams.gasLimit);
  if (txParams.gasPrice) cleaned.gasPrice = ensureHexPrefix(txParams.gasPrice);
  if (txParams.maxFeePerGas) cleaned.maxFeePerGas = ensureHexPrefix(txParams.maxFeePerGas);
  if (txParams.maxPriorityFeePerGas) cleaned.maxPriorityFeePerGas = ensureHexPrefix(txParams.maxPriorityFeePerGas);

  return cleaned;
}

// Main function to execute 1inch swap
export async function executeOneInchSwap(
  walletId: string,
  userAddress: string,
  tokenIn: string,
  tokenOut: string,
  amountIn: bigint,
  slippagePercent: number = 1
) {
  // Validate input parameters
  if (!walletId || !userAddress || !tokenIn || !tokenOut || amountIn <= 0n) {
    throw new Error(`Invalid parameters: walletId=${walletId}, userAddress=${userAddress}, tokenIn=${tokenIn}, tokenOut=${tokenOut}, amountIn=${amountIn}`);
  }

  //console.log('Starting 1inch swap process...');

  // Add initial delay to avoid rate limiting
  //console.log('Adding delay to prevent rate limiting...');
  await sleep(1000);

  // Step 1: Check allowance
  const allowance = await checkOneInchAllowance(tokenIn, userAddress);
  console.log('Current allowance:', allowance);

  // Step 2: Approve if needed
  if (BigInt(allowance) < amountIn) {
    //console.log('Insufficient allowance, creating approval transaction...');
    
    // Add delay before approval request
    await sleep(1500);
    
    const rawApprovalTx = await buildApprovalTransaction(tokenIn);
    console.log('Raw approval tx from 1inch:', JSON.stringify(rawApprovalTx, null, 2));
    
    // Convert 1inch format to Privy-compatible format
    const approvalTx = {
      to: rawApprovalTx.to,
      data: rawApprovalTx.data,
      value: rawApprovalTx.value ? `0x${parseInt(rawApprovalTx.value).toString(16)}` : '0x0',
      gasPrice: rawApprovalTx.gasPrice ? `0x${parseInt(rawApprovalTx.gasPrice).toString(16)}` : undefined,
      gasLimit: rawApprovalTx.gas ? `0x${parseInt(rawApprovalTx.gas).toString(16)}` : '0x15F90',
    };

    // Remove undefined values
    Object.keys(approvalTx).forEach(key => {
      if (approvalTx[key] === undefined) {
        delete approvalTx[key];
      }
    });


    console.log('Final approval tx params:', JSON.stringify(approvalTx, null, 2));
    console.log('Sending approval transaction...');
    console.log('walletId', walletId);
    const approvalReceipt = await sendTransaction(walletId, approvalTx);
    console.log('Approval transaction confirmed:', approvalReceipt.transactionHash);
  }

  // Step 3: Build swap transaction
  const swapParams: SwapParams = {
    src: tokenIn,
    dst: tokenOut,
    amount: amountIn.toString(),
    from: userAddress,
    slippage: slippagePercent,
    disableEstimate: false,
    allowPartialFill: false
  };

  //console.log('Building swap transaction...');
  
  // Add delay before swap request
  await sleep(2000); // Longer delay for the main swap call
  
  const rawSwapTx = await buildSwapTransaction(swapParams);
  //console.log('Raw swap tx from 1inch:', JSON.stringify(rawSwapTx, null, 2));

  // Convert 1inch format to Privy-compatible format
  const swapTx = {
    to: rawSwapTx.to,
    data: rawSwapTx.data,
    value: rawSwapTx.value ? `0x${parseInt(rawSwapTx.value).toString(16)}` : '0x0',
    gasPrice: rawSwapTx.gasPrice ? `0x${parseInt(rawSwapTx.gasPrice).toString(16)}` : undefined,
    gasLimit: rawSwapTx.gas ? `0x${parseInt(rawSwapTx.gas).toString(16)}` : '0x7A120',
  };

  // Remove undefined values
  Object.keys(swapTx).forEach(key => {
    if (swapTx[key] === undefined) {
      delete swapTx[key];
    }
  });

  // Step 4: Execute swap
  //console.log('Final swap tx params:', JSON.stringify(swapTx, null, 2));
  //console.log('Executing swap...');
  const swapReceipt = await sendTransaction(walletId, swapTx);
  //console.log('Swap completed:', swapReceipt.transactionHash);

  return swapReceipt;
}

// Helper function to handle rate limiting errors with guidance
export function handleRateLimitError(): string {
  return `
🚨 1inch API Rate Limit Exceeded!
  `;
}

// Test 1inch API connectivity
export async function test1inchAPI(): Promise<any> {
  // Try to get tokens list first (simpler endpoint)
  const url = `${apiBaseUrl}/tokens`;
  
  //console.log('Testing 1inch API connection...');
  //console.log('URL:', url);
  //console.log('Headers:', headers);

  try {
    const response = await fetch(url, { headers });
    
    //console.log('Response status:', response.status);
    //console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`1inch API test failed (${response.status}):`, errorText);
      return { 
        success: false, 
        status: response.status, 
        error: errorText,
        message: 'API connection failed'
      };
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('Non-JSON response:', responseText);
      return { 
        success: false, 
        error: 'Non-JSON response',
        content: responseText.substring(0, 200) // First 200 chars
      };
    }
    
    const data = await response.json();
    //console.log('1inch API test successful!');
    
    return { 
      success: true, 
      tokenCount: Object.keys(data.tokens || {}).length,
      message: '1inch API is working'
    };
  } catch (error) {
    console.error('1inch API test error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      message: 'Network or parsing error'
    };
  }
}

// Get quote from 1inch (optional helper function)
export async function getOneInchQuote(
  tokenIn: string,
  tokenOut: string,
  amountIn: bigint
): Promise<any> {
  const url = apiRequestUrl('/quote', {
    src: tokenIn,
    dst: tokenOut,
    amount: amountIn.toString()
  });

  //console.log('1inch quote URL:', url);

  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`1inch API error (${response.status}):`, errorText);
      throw new Error(`1inch API error: ${response.status} - ${errorText}`);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('Non-JSON response:', responseText);
      throw new Error(`Expected JSON response, got: ${contentType}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`1inch API error: ${data.description || data.error}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error getting quote:', error);
    throw error;
  }
}

// Fixed 1inch swap execution
export async function executeFixed1inchSwap(
  walletId: string,
  userAddress: string,
  tokenIn: string,
  tokenOut: string,
  amountIn: bigint,
  slippagePercent: number = 1
) {
  //console.log('Starting fixed 1inch swap...');

  try {
    // Step 1: Check allowance with delay
    await sleep(1000);
    const allowance = await checkOneInchAllowance(tokenIn, userAddress);
    //console.log('Current allowance:', allowance);

    // Step 2: Approve if needed
    if (BigInt(allowance) < amountIn) {
      //console.log('Building approval transaction...');
      await sleep(1500);
      
      const rawApprovalTx = await buildApprovalTransaction(tokenIn);
      //console.log('Raw 1inch approval:', rawApprovalTx);
      
      // Convert to Privy format
      const approvalTx = convertToPrivyFormat(rawApprovalTx);
      //console.log('Converted approval for Privy:', approvalTx);
      
      // Send approval
      const approvalReceipt = await sendTransaction(walletId, approvalTx);
      //console.log('Approval confirmed:', approvalReceipt.transactionHash);
    }

    // Step 3: Build and execute swap
    //console.log('Building swap transaction...');
    await sleep(2000);
    
    const swapParams: SwapParams = {
      src: tokenIn,
      dst: tokenOut,
      amount: amountIn.toString(),
      from: userAddress,
      slippage: slippagePercent,
      disableEstimate: false,
      allowPartialFill: false
    };

    const rawSwapTx = await buildSwapTransaction(swapParams);
    //console.log('Raw 1inch swap:', rawSwapTx);
    
    // Convert to Privy format
    const swapTx = convertToPrivyFormat(rawSwapTx);
    //console.log('Converted swap for Privy:', swapTx);
    
    // Send swap
    const swapReceipt = await sendTransaction(walletId, swapTx);
    //console.log('Swap completed:', swapReceipt.transactionHash);

    return swapReceipt;

  } catch (error) {
    console.error('Fixed 1inch swap failed:', error);
    throw error;
  }
} 