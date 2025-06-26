const fs = require('fs');
const path = require('path');

// Generate assets from filtered virtuals agents
function generateAssetsFromVirtuals() {
  // Read the filtered virtuals agents file as text
  const filePath = path.join(__dirname, 'outputs/filtered-virtuals-agents.js');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Extract the JSON array from the file content
  const arrayStart = fileContent.indexOf('[');
  const arrayEnd = fileContent.lastIndexOf('];') + 1;
  let arrayContent = fileContent.slice(arrayStart, arrayEnd);
  
  // Clean up trailing commas before parsing
  arrayContent = arrayContent.replace(/,(\s*[}\]])/g, '$1');
  
  // Parse the JSON array
  const filteredVirtualsAgents = JSON.parse(arrayContent);
  
  //console.log(`Processing ${filteredVirtualsAgents.length} virtuals agents...`);
  
  const assets = filteredVirtualsAgents.map(agent => ({
    symbol: agent.symbol,
    name: agent.name,
    address: agent.tokenAddress,
    chain: "base",
    decimals: 18
  }));

  //console.log(`Generated ${assets.length} assets`);
  
  // Create the output content
  const outputContent = `// Generated assets from virtuals agents
// Generated on ${new Date().toISOString()}
// Total assets: ${assets.length}

import { Asset } from "../lib/assets/utils";

export const VIRTUALS_ASSETS: Asset[] = ${JSON.stringify(assets, null, 2)};
`;

  // Write to output file
  const outputPath = path.join(process.cwd(), 'scripts/outputs/virtuals-assets.js');
  fs.writeFileSync(outputPath, outputContent);
  
  //console.log(`Assets written to: ${outputPath}`);
  
  // Also create TypeScript version
  const tsOutputContent = `// Generated assets from virtuals agents
// Generated on ${new Date().toISOString()}
// Total assets: ${assets.length}

import { Asset } from "../../lib/assets/utils";

export const VIRTUALS_ASSETS: Asset[] = ${JSON.stringify(assets, null, 2)};
`;

  const tsOutputPath = path.join(process.cwd(), 'scripts/outputs/virtuals-assets.ts');
  fs.writeFileSync(tsOutputPath, tsOutputContent);
  
  //console.log(`TypeScript assets written to: ${tsOutputPath}`);
  
  return assets;
}

// Run the script
if (require.main === module) {
  try {
    const assets = generateAssetsFromVirtuals();
    //console.log('\n=== Sample Assets ===');
    //console.log(JSON.stringify(assets.slice(0, 3), null, 2));
    //console.log(`\n... and ${assets.length - 3} more assets`);
  } catch (error) {
    console.error('Error generating assets:', error);
    process.exit(1);
  }
}

module.exports = { generateAssetsFromVirtuals }; 