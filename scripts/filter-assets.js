// Script to iterate through each ASSET, use getAssetByAddress, getTokenPricesBySymbols 
// and print all symbols, addresses and market caps

const fs = require('fs');
const path = require('path');
const { ASSETS } = require('../lib/assets/assets.ts');
const { getAssetByAddress, getTokenPricesBySymbols, getTokenInfoByAddresses } = require('../lib/assets/utils.ts');

// Helper function to add delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  //console.log(`Starting analysis of ${ASSETS.length} assets...\n`);
  
  // Print header
  //console.log('=== ASSET ANALYSIS RESULTS ===\n');
  //console.log('Symbol'.padEnd(12) + 'Address'.padEnd(45) + 'Price ($)'.padEnd(15) + 'Market Cap ($)'.padEnd(20));
  //console.log('-'.repeat(90));
  
  let totalMarketCap = 0;
  let assetsWithData = 0;
  let processedCount = 0;
  
  // Setup output file
  const outputPath = path.join(__dirname, 'filtered-assets.js');
  const fileHeader = `// Filtered assets with valid price and market cap data
// Generated on ${new Date().toISOString()}
// Processing in real-time...

export const FILTERED_ASSETS = [
`;
  
  // Create file with header
  fs.writeFileSync(outputPath, fileHeader, 'utf8');
  //console.log(`📝 Created output file: ${outputPath}`);
  
  // Process assets in batches of 5
  const batchSize = 5;
  
  try {
    for (let i = 0; i < ASSETS.length; i += batchSize) {
      const batch = ASSETS.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(ASSETS.length / batchSize);
      
      //console.log(`\n[Batch ${batchNumber}/${totalBatches}] Processing assets ${i + 1}-${Math.min(i + batchSize, ASSETS.length)}...`);
      
      // Get symbols and addresses for this batch
      const batchSymbols = batch.map(asset => asset.symbol);
      const batchAddresses = batch.map(asset => asset.address);
      
      // Fetch price and market cap data for this batch
      const priceResults = await getTokenPricesBySymbols(batchSymbols);
      const priceMap = new Map(priceResults.map(result => [result.symbol, result.price]));
      
      const tokenInfoResults = await getTokenInfoByAddresses(batchAddresses);
      const tokenInfoMap = new Map(tokenInfoResults.map(result => [result.address.toLowerCase(), result]));
      
      // Process and print each asset in this batch
      for (const asset of batch) {
        // Use getAssetByAddress to verify the asset (as requested)
        const assetData = getAssetByAddress(asset.address);
        
        if (assetData) {
          const priceRaw = priceMap.get(asset.symbol) || 0;
          const price = typeof priceRaw === 'string' ? parseFloat(priceRaw) : priceRaw;
          const tokenInfo = tokenInfoMap.get(asset.address.toLowerCase());
          const marketCapRaw = tokenInfo ? tokenInfo.fdv : 0;
          const marketCap = typeof marketCapRaw === 'string' ? parseFloat(marketCapRaw) : marketCapRaw;
          
          // Format the output
          const symbolStr = asset.symbol.padEnd(12);
          const addressStr = asset.address.padEnd(45);
          const priceStr = (price && price > 0) ? `$${price.toFixed(8)}`.padEnd(15) : 'N/A'.padEnd(15);
          const marketCapStr = (marketCap && marketCap > 0) ? `$${marketCap.toLocaleString()}`.padEnd(20) : 'N/A'.padEnd(20);
          
          //console.log(`${symbolStr}${addressStr}${priceStr}${marketCapStr}`);
          
          // Only add to filtered assets if both price and market cap are valid
          if (price && price > 0 && marketCap && marketCap > 0) {
            const assetEntry = {
              symbol: asset.symbol,
              address: asset.address,
              chain: asset.chain,
              decimals: asset.decimals
            };
            
            // Append to file immediately
            const assetLine = `  ${JSON.stringify(assetEntry)},\n`;
            fs.appendFileSync(outputPath, assetLine, 'utf8');
            
            totalMarketCap += marketCap;
            assetsWithData++;
            
            //console.log(`  ✅ Added ${asset.symbol} to file`);
          }
          
          processedCount++;
        }
      }
      
      // Add delay between batches (except for the last batch)
      if (i + batchSize < ASSETS.length) {
        //console.log(`[Batch ${batchNumber} completed] Waiting 5 seconds before next batch...`);
        await delay(5000);
      }
    }
    
    //console.log('-'.repeat(90));
    //console.log(`\nFINAL SUMMARY:`);
    //console.log(`Total Assets Processed: ${processedCount}`);
    //console.log(`Assets with Valid Data: ${assetsWithData}`);
    //console.log(`Total Combined Market Cap: $${totalMarketCap.toLocaleString()}`);
    //console.log(`Average Market Cap: $${assetsWithData > 0 ? (totalMarketCap / assetsWithData).toLocaleString() : 'N/A'}`);
    
    // Close the array and add final comments
    const fileFooter = `];

// Generation completed on ${new Date().toISOString()}
// Total valid assets: ${assetsWithData} out of ${ASSETS.length}
// Success rate: ${((assetsWithData / ASSETS.length) * 100).toFixed(1)}%
`;
    
    fs.appendFileSync(outputPath, fileFooter, 'utf8');
    //console.log(`\n✅ File completed: ${outputPath}`);
    //console.log(`📊 ${assetsWithData} valid assets out of ${ASSETS.length} total assets`);
    //console.log(`📈 Success rate: ${((assetsWithData / ASSETS.length) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('Error during analysis:', error);
    //console.log(`\nPartial results before error:`);
    //console.log(`Assets processed: ${processedCount}`);
    //console.log(`Assets with data: ${assetsWithData}`);
    //console.log(`Total market cap so far: $${totalMarketCap.toLocaleString()}`);
    
    // Close the file properly even if there was an error
    try {
      const errorFooter = `];

// Generation failed on ${new Date().toISOString()}
// Partial results: ${assetsWithData} assets processed before error
// Error: ${error.message}
`;
      fs.appendFileSync(outputPath, errorFooter, 'utf8');
      //console.log(`💾 Partial results saved to: ${outputPath}`);
      //console.log(`📊 ${assetsWithData} assets were saved before the error occurred`);
    } catch (fileError) {
      console.error('Could not close the output file:', fileError.message);
    }
  }
}

// Run the script
main().catch(console.error);
