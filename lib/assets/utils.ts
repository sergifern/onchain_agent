import { ASSETS } from "./assets";


export type Asset = {
  symbol: string;
  name: string;
  address: string;
  chain: string;
  decimals: number;
};

export const getAssetBySymbol = (symbol: string): Asset | undefined => {
  return ASSETS.find((asset) => asset.symbol === symbol);
};

export const getAssetByAddress = (address: string): Asset | undefined => {
  return ASSETS.find((asset) => asset.address.toLowerCase() === address.toLowerCase());
};

// get token prices by symbols (up to 30 at a time)
export const getTokenPricesBySymbols = async (symbols: string[]): Promise<{ symbol: string; price: number }[]> => {
  // Get assets for all symbols
  const assets = symbols.map(symbol => getAssetBySymbol(symbol)).filter((asset): asset is Asset => asset !== undefined);
  
  if (assets.length === 0) {
    return [];
  }

  // Group assets by chain
  const assetsByChain = assets.reduce((acc, asset) => {
    if (!acc[asset.chain]) {
      acc[asset.chain] = [];
    }
    acc[asset.chain].push(asset);
    return acc;
  }, {} as Record<string, Asset[]>);

  const results: { symbol: string; price: number }[] = [];

  // Process each chain's assets in batches of 30
  for (const [chain, chainAssets] of Object.entries(assetsByChain)) {
    for (let i = 0; i < chainAssets.length; i += 30) {
      const batch = chainAssets.slice(i, i + 30);
      const addresses = batch.map(asset => asset.address).join(',');
      
      try {
        const response = await fetch(`https://api.dexscreener.com/tokens/v1/${chain}/${addresses}`);

        console.log(response);
        const data = await response.json();
        
        // Map prices back to symbols
        batch.forEach((asset, index) => {
          if (data[index]?.priceUsd) {
            results.push({
              symbol: asset.symbol,
              price: data[index].priceUsd
            });
          } else {
            results.push({
              symbol: asset.symbol,
              price: 0
            });
          }
        });
      } catch (error) {
        console.error(`Failed to fetch prices for chain ${chain}:`, error);
        // Add failed symbols with price 0
        batch.forEach(asset => {
          results.push({
            symbol: asset.symbol,
            price: 0
          });
        });
      }
    }
  }

  return results;
};

// Keep the original function for backward compatibility
export const getTokenPriceBySymbol = async (symbol: string): Promise<number> => {
  const results = await getTokenPricesBySymbols([symbol]);
  return results[0]?.price || 0;
};

// get token prices by addresses (up to 30 at a time)
export const getTokenInfoByAddresses = async (addresses: string[]): Promise<{ address: string; price: number; fdv: number; imageUrl: string }[]> => {
  if (addresses.length === 0) {
    return [];
  }

  const results: { address: string; price: number; fdv: number; imageUrl: string }[] = [];

  // Process addresses in batches of 30
  for (let i = 0; i < addresses.length; i += 30) {
    const batch = addresses.slice(i, i + 30);
    const batchAddresses = batch.join(',');
    
    try {
      const response = await fetch(`https://api.dexscreener.com/tokens/v1/base/${batchAddresses}`);
      const data = await response.json();
      
      // Map prices back to addresses
      batch.forEach((address) => {
        // Find the matching pair data for this address
        const pairData = data.find((pair: any) => 
          pair.baseToken?.address?.toLowerCase() === address.toLowerCase() || 
          pair.quoteToken?.address?.toLowerCase() === address.toLowerCase()
        );

        if (pairData) {
          // If the address is the base token, use its price, otherwise use the inverse
          const isBaseToken = pairData.baseToken?.address?.toLowerCase() === address.toLowerCase();
          const price = isBaseToken ? pairData.priceUsd : (1 / pairData.priceNative) * pairData.priceUsd;
          
          results.push({
            address,
            price: price || 0,
            fdv: pairData.fdv || 0,
            imageUrl: pairData.info?.imageUrl || ''
          });
        } else {
          results.push({
            address,
            price: 0,
            fdv: 0,
            imageUrl: ''
          });
        }
      });
    } catch (error) {
      console.error(`Failed to fetch prices for chain base:`, error);
      // Add failed addresses with price 0
      batch.forEach(address => {
        results.push({
          address,
          price: 0,
          fdv: 0,
          imageUrl: ''
        });
      });
    }
  }

  return results;
};

// Keep the original function for backward compatibility
export const getTokenPriceByAddress = async (address: string, chain: string = 'base'): Promise<number> => {
  const results = await getTokenInfoByAddresses([address]);
  return results[0]?.price || 0;
};
