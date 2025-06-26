const { ethers } = require('ethers');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import functions using dynamic import since they're ES modules
async function loadSwapFunctions() {
  const swapModule = await import('../lib/agent/server-executions.js');
  return {
    sendTransaction: swapModule.sendTransaction,
    checkTokenAllowance: swapModule.checkTokenAllowance,
    approveToken: swapModule.approveToken,
    ensureTokenAllowance: swapModule.ensureTokenAllowance,
    executeSwap: swapModule.executeSwap,
    getTokenBalance: swapModule.getTokenBalance
  };
}

// Test configuration
const TEST_CONFIG = {
  // Replace with a test wallet address (make sure it has some tokens for testing)
  userAddress: "0xEFC124e58Fb2E5D67966E9141a63A3533C54cABB", // UPDATE THIS
  
  // Token addresses on Base
  tokens: {
    ETHY: "0xC44141a684f6AA4E36cD9264ab55550B03C88643",
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
    WETH: "0x4200000000000000000000000000000000000006", // WETH on Base
  },
  
  // Test amounts (in wei/smallest unit)
  testAmounts: {
    small: ethers.parseUnits("1", 18),      // 1 token
    medium: ethers.parseUnits("10", 18),    // 10 tokens
    large: ethers.parseUnits("100", 18),    // 100 tokens
  }
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBalance(balance, decimals = 18) {
  return ethers.formatUnits(balance.toString(), decimals);
}

async function testGetTokenBalance(swapFunctions) {
  log('\n=== Testing getTokenBalance ===', 'cyan');
  
  try {
    // Test ETHY balance
    const ethyBalance = await swapFunctions.getTokenBalance(TEST_CONFIG.userAddress, TEST_CONFIG.tokens.ETHY);
    log(`✅ ETHY Balance: ${formatBalance(ethyBalance)} ETHY`, 'green');
    
    // Test USDC balance
    const usdcBalance = await swapFunctions.getTokenBalance(TEST_CONFIG.userAddress, TEST_CONFIG.tokens.USDC);
    log(`✅ USDC Balance: ${formatBalance(usdcBalance, 6)} USDC`, 'green');
    
    // Test WETH balance
    const wethBalance = await swapFunctions.getTokenBalance(TEST_CONFIG.userAddress, TEST_CONFIG.tokens.WETH);
    log(`✅ WETH Balance: ${formatBalance(wethBalance)} WETH`, 'green');
    
    return { ethyBalance, usdcBalance, wethBalance };
  } catch (error) {
    log(`❌ Error getting token balances: ${error.message}`, 'red');
    throw error;
  }
}

async function testCheckTokenAllowance(swapFunctions) {
  log('\n=== Testing checkTokenAllowance ===', 'cyan');
  
  const routerAddress = "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24";
  
  try {
    // Check ETHY allowance
    const ethyAllowance = await swapFunctions.checkTokenAllowance(
      TEST_CONFIG.userAddress,
      TEST_CONFIG.tokens.ETHY,
      routerAddress
    );
    log(`✅ ETHY Allowance: ${formatBalance(ethyAllowance)} ETHY`, 'green');
    
    // Check USDC allowance
    const usdcAllowance = await swapFunctions.checkTokenAllowance(
      TEST_CONFIG.userAddress,
      TEST_CONFIG.tokens.USDC,
      routerAddress
    );
    log(`✅ USDC Allowance: ${formatBalance(usdcAllowance, 6)} USDC`, 'green');
    
    return { ethyAllowance, usdcAllowance };
  } catch (error) {
    log(`❌ Error checking allowances: ${error.message}`, 'red');
    throw error;
  }
}

async function testApproveToken(swapFunctions) {
  log('\n=== Testing approveToken ===', 'cyan');
  log('⚠️  This will create actual transactions - make sure you want to proceed!', 'yellow');
  
  const routerAddress = "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24";
  
  try {
    // Test approval for small amount
    log('📝 Approving ETHY tokens...', 'blue');
    const receipt = await swapFunctions.approveToken(
      TEST_CONFIG.userAddress,
      TEST_CONFIG.tokens.ETHY,
      routerAddress,
      TEST_CONFIG.testAmounts.small
    );
    
    log(`✅ Approval successful! Tx hash: ${receipt.transactionHash}`, 'green');
    log(`   Gas used: ${receipt.gasUsed.toString()}`, 'blue');
    
    return receipt;
  } catch (error) {
    log(`❌ Error approving token: ${error.message}`, 'red');
    throw error;
  }
}

async function testEnsureTokenAllowance(swapFunctions) {
  log('\n=== Testing ensureTokenAllowance ===', 'cyan');
  log('⚠️  This may create actual transactions if allowance is insufficient!', 'yellow');
  
  const routerAddress = "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24";
  
  try {
    log('🔍 Ensuring sufficient ETHY allowance...', 'blue');
    await swapFunctions.ensureTokenAllowance(
      TEST_CONFIG.userAddress,
      TEST_CONFIG.tokens.ETHY,
      routerAddress,
      TEST_CONFIG.testAmounts.medium
    );
    
    log('✅ Token allowance ensured successfully!', 'green');
    
    // Verify the allowance was set
    const newAllowance = await swapFunctions.checkTokenAllowance(
      TEST_CONFIG.userAddress,
      TEST_CONFIG.tokens.ETHY,
      routerAddress
    );
    log(`   New allowance: ${formatBalance(newAllowance)} ETHY`, 'blue');
    
  } catch (error) {
    log(`❌ Error ensuring allowance: ${error.message}`, 'red');
    throw error;
  }
}

async function testExecuteSwap(swapFunctions) {
  log('\n=== Testing executeSwap ===', 'cyan');
  log('⚠️  This will create actual swap transactions!', 'yellow');
  
  try {
    // Test swap: ETHY -> USDC
    const swapPath = [TEST_CONFIG.tokens.ETHY, TEST_CONFIG.tokens.USDC];
    const amountIn = TEST_CONFIG.testAmounts.small; // 1 ETHY
    const amountOutMin = 0n; // Accept any amount (no slippage protection for testing)
    
    log(`📝 Executing swap: ${formatBalance(amountIn)} ETHY -> USDC`, 'blue');
    log(`   Path: ${swapPath.join(' -> ')}`, 'blue');
    
    const receipt = await swapFunctions.executeSwap(
      TEST_CONFIG.userAddress,
      amountIn,
      amountOutMin,
      swapPath
    );
    
    log(`✅ Swap successful! Tx hash: ${receipt.transactionHash}`, 'green');
    log(`   Gas used: ${receipt.gasUsed.toString()}`, 'blue');
    log(`   Block number: ${receipt.blockNumber}`, 'blue');
    
    return receipt;
  } catch (error) {
    log(`❌ Error executing swap: ${error.message}`, 'red');
    throw error;
  }
}

async function testCompleteSwapFlow(swapFunctions) {
  log('\n=== Testing Complete Swap Flow ===', 'cyan');
  
  try {
    // 1. Check initial balances
    log('1️⃣ Checking initial balances...', 'blue');
    const initialBalances = await testGetTokenBalance(swapFunctions);
    
    // 2. Check current allowances
    log('2️⃣ Checking current allowances...', 'blue');
    await testCheckTokenAllowance(swapFunctions);
    
    // 3. Ensure sufficient allowance
    log('3️⃣ Ensuring sufficient allowance...', 'blue');
    await testEnsureTokenAllowance(swapFunctions);
    
    // 4. Execute swap (commented out for safety)
    log('4️⃣ Ready to execute swap (uncomment to test)...', 'yellow');
    // await testExecuteSwap(swapFunctions);
    
    // 5. Check final balances
    log('5️⃣ Checking final balances...', 'blue');
    const finalBalances = await testGetTokenBalance(swapFunctions);
    
    log('\n🎉 Complete flow test finished successfully!', 'green');
    
  } catch (error) {
    log(`❌ Complete flow test failed: ${error.message}`, 'red');
    throw error;
  }
}

// Utility function to simulate swap without executing
async function simulateSwap(swapFunctions) {
  log('\n=== Simulating Swap (Read-only) ===', 'cyan');
  
  try {
    const swapPath = [TEST_CONFIG.tokens.ETHY, TEST_CONFIG.tokens.USDC];
    const amountIn = TEST_CONFIG.testAmounts.small;
    
    log(`📊 Simulating swap: ${formatBalance(amountIn)} ETHY -> USDC`, 'blue');
    log(`   Input token: ${swapPath[0]}`, 'blue');
    log(`   Output token: ${swapPath[1]}`, 'blue');
    log(`   Amount in: ${formatBalance(amountIn)} ETHY`, 'blue');
    
    // Check if user has sufficient balance
    const balance = await swapFunctions.getTokenBalance(TEST_CONFIG.userAddress, swapPath[0]);
    if (balance < amountIn) {
      log(`⚠️  Insufficient balance! Have: ${formatBalance(balance)}, Need: ${formatBalance(amountIn)}`, 'yellow');
    } else {
      log(`✅ Sufficient balance for swap`, 'green');
    }
    
    // Check allowance
    const allowance = await swapFunctions.checkTokenAllowance(
      TEST_CONFIG.userAddress,
      swapPath[0],
      "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24"
    );
    
    if (allowance < amountIn) {
      log(`⚠️  Insufficient allowance! Have: ${formatBalance(allowance)}, Need: ${formatBalance(amountIn)}`, 'yellow');
    } else {
      log(`✅ Sufficient allowance for swap`, 'green');
    }
    
  } catch (error) {
    log(`❌ Error simulating swap: ${error.message}`, 'red');
  }
}

// Main test function
async function runTests() {
  log('🚀 Starting Swap Functions Test Suite', 'magenta');
  log('=====================================', 'magenta');
  
  try {
    // Load the swap functions
    log('📦 Loading swap functions...', 'blue');
    const swapFunctions = await loadSwapFunctions();
    log('✅ Swap functions loaded successfully!', 'green');
    
    // Run read-only tests first
    await testGetTokenBalance(swapFunctions);
    await testCheckTokenAllowance(swapFunctions);
    await simulateSwap(swapFunctions);
    
    log('\n📋 Next steps for full testing:', 'yellow');
    log('1. Make sure your wallet has some ETHY tokens', 'yellow');
    log('2. Uncomment the transaction tests below to test actual transactions', 'yellow');
    log('3. Be aware that real transactions will cost gas and move tokens!', 'yellow');
    
    // Uncomment these lines to test actual transactions (BE CAREFUL!)
    // await testApproveToken(swapFunctions);
    // await testEnsureTokenAllowance(swapFunctions);
    // await testExecuteSwap(swapFunctions);
    // await testCompleteSwapFlow(swapFunctions);
    
    log('\n✅ Test suite completed successfully!', 'green');
    
  } catch (error) {
    log(`\n❌ Test suite failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  testGetTokenBalance,
  testCheckTokenAllowance,
  testApproveToken,
  testEnsureTokenAllowance,
  testExecuteSwap,
  testCompleteSwapFlow,
  simulateSwap
}; 