// Script to filter virtuals agents by checking token address prices
// Remove agents with NA or invalid prices

const fs = require('fs');
const path = require('path');

// For Node.js versions that don't have fetch built-in
const fetch = globalThis.fetch || require('node-fetch');

// Read and parse the all-virtuals-agents.js file
function loadVirtualsAgents() {
  const agentsFilePath = path.join(__dirname, 'outputs/all-virtuals-agents.js');
  const fileContent = fs.readFileSync(agentsFilePath, 'utf8');
  
  // Extract the JSON data from the export statement
  const jsonMatch = fileContent.match(/export const allVirtualsAgents = (\[[\s\S]*\]);/);
  if (!jsonMatch) {
    throw new Error('Could not parse allVirtualsAgents from file');
  }
  
  return JSON.parse(jsonMatch[1]);
}

const allVirtualsAgents = loadVirtualsAgents();

// Helper function to add delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to get token price by address and chain
async function getTokenPriceByAddress(address, chain = 'base') {
  try {
    const chainParam = chain.toLowerCase();
    const response = await fetch(`https://api.dexscreener.com/tokens/v1/${chainParam}/${address}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      // Find the first pair with a valid price
      const validPair = data.find(pair => pair.priceUsd && parseFloat(pair.priceUsd) > 0);
      if (validPair) {
        return parseFloat(validPair.priceUsd);
      }
    }
    
    return 0;
  } catch (error) {
    // Don't log individual errors here, let the retry logic handle it
    throw error;
  }
}

// Function to get token price with retry logic
async function getTokenPriceWithRetry(address, chain = 'base') {
  let retryCount = 0;
  const maxRetries = 3;
  
  while (retryCount <= maxRetries) {
    try {
      const price = await getTokenPriceByAddress(address, chain);
      return price;
    } catch (error) {
      retryCount++;
      if (retryCount <= maxRetries) {
        const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2s, 4s, 8s
        //console.log(`  ⚠️  Error fetching price for ${address}. Waiting ${waitTime/1000}s before retry ${retryCount}/${maxRetries}...`);
        await delay(waitTime);
      } else {
        console.error(`  ❌ Failed to fetch price for ${address} after ${maxRetries} retries:`, error.message);
        return 0;
      }
    }
  }
  return 0;
}

async function main() {
  //console.log(`Starting analysis of ${allVirtualsAgents.length} virtuals agents...\n`);
  
  // Print header
  //console.log('=== VIRTUALS AGENTS PRICE ANALYSIS ===\n');
  //console.log('Symbol'.padEnd(15) + 'Chain'.padEnd(10) + 'Address'.padEnd(45) + 'Price ($)'.padEnd(15));
  //console.log('-'.repeat(85));
  
  let agentsWithValidPrice = 0;
  let processedCount = 0;
  
  // Setup output file
  const outputPath = path.join(__dirname, 'outputs/filtered-virtuals-agents.js');
  const fileHeader = `// Filtered virtuals agents with valid price data
// Generated on ${new Date().toISOString()}
// Only includes agents with valid token prices > 0

export const filteredVirtualsAgents = [
`;
  
  // Create file with header
  fs.writeFileSync(outputPath, fileHeader, 'utf8');
  //console.log(`📝 Created output file: ${outputPath}`);
  
  // Process agents one by one with delays to avoid rate limiting
  for (let i = 0; i < allVirtualsAgents.length; i++) {
    const agent = allVirtualsAgents[i];
    processedCount++;
    
    // Progress indicator
    if (processedCount % 10 === 0) {
      try {
        //console.log(`\n📊 Progress: ${processedCount}/${allVirtualsAgents.length} (${((processedCount / allVirtualsAgents.length) * 100).toFixed(1)}%)`);
      } catch (error) {
        if (error.code === 'EPIPE') process.exit(0);
        throw error;
      }
    }
    
    // Skip agents without token address
    if (!agent.tokenAddress) {
      try {
        //console.log(`${agent.symbol.padEnd(15)}${(agent.chain || 'N/A').padEnd(10)}${'NO_ADDRESS'.padEnd(45)}${'SKIPPED'.padEnd(15)}`);
      } catch (error) {
        if (error.code === 'EPIPE') process.exit(0);
        throw error;
      }
      continue;
    }

    // Get token price
    const chain = agent.chain ? agent.chain.toLowerCase() : 'base';
    const price = await getTokenPriceWithRetry(agent.tokenAddress, chain);
    
    // Format the output
    const symbolStr = agent.symbol.padEnd(15);
    const chainStr = (agent.chain || 'N/A').padEnd(10);
    const addressStr = agent.tokenAddress.padEnd(45);
    const priceStr = (price && price > 0) ? `$${price.toFixed(8)}`.padEnd(15) : 'N/A'.padEnd(15);
    
    // Safe console logging (handle EPIPE errors when piped)
    try {
      //console.log(`${symbolStr}${chainStr}${addressStr}${priceStr}`);
    } catch (error) {
      if (error.code === 'EPIPE') {
        process.exit(0);
      }
      throw error;
    }
    
    // Only add to filtered agents if price is valid and > 0
    if (price && price > 0) {
      // Create a clean agent object for the filtered list
      const filteredAgent = {
        id: agent.id,
        virtualId: agent.virtualId,
        symbol: agent.symbol,
        name: agent.name,
        description: agent.description,
        tokenAddress: agent.tokenAddress,
        agentStakingContract: agent.agentStakingContract,
        chain: agent.chain,
        imageUrl: agent.imageUrl,
        genesis: agent.genesis,
        creator: agent.creator,
        priceData: {
          price: price,
          lastUpdated: new Date().toISOString()
        }
      };
      
      // Append to file immediately
      const agentLine = `  ${JSON.stringify(filteredAgent, null, 2)},\n`;
      fs.appendFileSync(outputPath, agentLine, 'utf8');
      
      agentsWithValidPrice++;
      
      try {
        //console.log(`  ✅ Added ${agent.symbol} to filtered list (Price: $${price.toFixed(8)})`);
      } catch (error) {
        if (error.code === 'EPIPE') process.exit(0);
        throw error;
      }
    } else {
      try {
        //console.log(`  ❌ Skipped ${agent.symbol} - no valid price data`);
      } catch (error) {
        if (error.code === 'EPIPE') process.exit(0);
        throw error;
      }
    }
    
    // Add delay between requests to avoid rate limiting (2 seconds)
    if (i < allVirtualsAgents.length - 1) {
      await delay(2000);
    }
  }
  
  //console.log('-'.repeat(85));
  //console.log(`\nFINAL SUMMARY:`);
  //console.log(`Total Agents Processed: ${processedCount}`);
  //console.log(`Agents with Valid Price Data: ${agentsWithValidPrice}`);
  //console.log(`Success Rate: ${((agentsWithValidPrice / processedCount) * 100).toFixed(1)}%`);
  
  // Close the array and add final comments
  const fileFooter = `];

// Generation completed on ${new Date().toISOString()}
// Total valid agents: ${agentsWithValidPrice} out of ${processedCount}
// Success rate: ${((agentsWithValidPrice / processedCount) * 100).toFixed(1)}%
`;
  
  fs.appendFileSync(outputPath, fileFooter, 'utf8');
  //console.log(`\n✅ Filtering completed: ${outputPath}`);
  //console.log(`📊 ${agentsWithValidPrice} valid agents out of ${processedCount} total agents`);
  //console.log(`📈 Success rate: ${((agentsWithValidPrice / processedCount) * 100).toFixed(1)}%`);
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  // Handle EPIPE errors gracefully (when piped to head, tail, etc.)
  if (error.code === 'EPIPE') {
    process.exit(0);
  }
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Handle SIGPIPE signal (when output is piped to commands like head)
process.on('SIGPIPE', () => {
  process.exit(0);
});

// Run the script
main().catch(console.error); 