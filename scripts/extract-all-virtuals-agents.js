const fs = require('fs');
const path = require('path');

// API endpoint configuration
const BASE_URL = 'https://api2.virtuals.io/api/virtuals';
const PARAMS = {
  'filters[status]': '2',
  'sort[0]': 'lpCreatedAt:desc',
  'sort[1]': 'createdAt:desc',
  'populate[0]': 'image',
  'populate[1]': 'genesis',
  'populate[2]': 'creator',
  'pagination[pageSize]': '25',
  'isGrouped': '1',
  'noCache': '0'
};

// Output file path
const OUTPUT_FILE = path.join(__dirname, 'all-virtuals-agents.js');

// Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to build URL with parameters
function buildUrl(page = 1) {
  const url = new URL(BASE_URL);
  Object.entries(PARAMS).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  url.searchParams.append('pagination[page]', page.toString());
  return url.toString();
}

// Function to extract agent data with required fields
function extractAgentData(agent) {
  const extractedAgent = {
    id: agent.id,
    virtualId: agent.virtualId,
    symbol: agent.symbol,
    name: agent.name,
    description: agent.description,
    tokenAddress: agent.tokenAddress,
    agentStakingContract: agent.agentStakingContract,
    chain: agent.chain,
    imageUrl: agent.image?.url || null,
    genesis: null,
    creator: {
      id: agent.creator?.id || null,
      username: agent.creator?.username || null
    }
  };

  // Handle genesis data (can be null or have data)
  if (agent.genesis) {
    extractedAgent.genesis = {
      id: agent.genesis.id,
      status: agent.genesis.status,
      startsAt: agent.genesis.startsAt,
      endsAt: agent.genesis.endsAt,
      genesisId: agent.genesis.genesisId
    };
  }

  return extractedAgent;
}

// Function to append data to file
function appendToFile(data, isFirst = false) {
  const content = isFirst 
    ? `// Auto-generated file with all Virtuals agents\n// Generated on: ${new Date().toISOString()}\n\nexport const allVirtualsAgents = [\n${JSON.stringify(data, null, 2)}`
    : `,\n${JSON.stringify(data, null, 2)}`;
  
  fs.appendFileSync(OUTPUT_FILE, content);
}

// Function to close the array in the file
function closeArrayInFile() {
  fs.appendFileSync(OUTPUT_FILE, '\n];\n');
}

// Main extraction function
async function extractAllAgents() {
  console.log('🚀 Starting extraction of all Virtuals agents...');
  console.log(`📊 API Endpoint: ${BASE_URL}`);
  console.log(`📁 Output file: ${OUTPUT_FILE}`);
  console.log('⏱️  Sleep delay: 2 seconds between requests\n');

  // Initialize output file
  if (fs.existsSync(OUTPUT_FILE)) {
    fs.unlinkSync(OUTPUT_FILE);
  }

  let currentPage = 1;
  let totalExtracted = 0;
  let isFirstAgent = true;

  try {
    while (true) {
      console.log(`📄 Fetching page ${currentPage}...`);
      
      const url = buildUrl(currentPage);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if we have data
      if (!data.data || data.data.length === 0) {
        console.log(`✅ No more data found on page ${currentPage}. Extraction complete!`);
        break;
      }

      console.log(`📦 Found ${data.data.length} agents on page ${currentPage}`);

      // Process each agent
      for (const agent of data.data) {
        const extractedAgent = extractAgentData(agent);
        
        // Append to file immediately
        appendToFile(extractedAgent, isFirstAgent);
        isFirstAgent = false;
        totalExtracted++;

        console.log(`  ✓ Extracted: ${extractedAgent.symbol} (${extractedAgent.name}) - ID: ${extractedAgent.id}`);
      }

      // Check pagination info
      const { page, pageCount, total } = data.meta.pagination;
      console.log(`📊 Page ${page} of ${pageCount} (${totalExtracted}/${total} agents extracted)`);

      // Break if we've reached the last page
      if (page >= pageCount) {
        console.log('✅ Reached last page. Extraction complete!');
        break;
      }

      // Sleep to avoid rate limiting
      console.log('⏳ Sleeping for 2 seconds...\n');
      await sleep(2000);

      currentPage++;
    }

    // Close the array in the file
    closeArrayInFile();

    console.log(`\n🎉 Extraction completed successfully!`);
    console.log(`📊 Total agents extracted: ${totalExtracted}`);
    console.log(`📁 Data saved to: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('❌ Error during extraction:', error.message);
    
    // If we have partial data, still close the array
    if (totalExtracted > 0) {
      closeArrayInFile();
      console.log(`⚠️  Partial data saved (${totalExtracted} agents)`);
    }
    
    process.exit(1);
  }
}

// Run the extraction
if (require.main === module) {
  extractAllAgents();
}

module.exports = { extractAllAgents }; 