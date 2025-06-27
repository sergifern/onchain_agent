import { NextRequest, NextResponse } from 'next/server';
import { getTokenInfoByAddresses } from '@/lib/assets/utils';
import { verifyUserAuth } from '@/lib/privy/users';
import { virtualsAgents } from '@/lib/virtuals/agents';

interface Token {
  token_address: string;
  balance: string;
  decimals: number;
  price?: number;
  balanceInUsd?: number;
  imageUrl?: string;
  symbol?: string;
  name?: string;
}

// Helper function to check if token exists in virtual agents
function isVirtualAgentToken(tokenAddress: string): boolean {
  return virtualsAgents.some(agent => 
    agent.tokenAddress?.toLowerCase() === tokenAddress.toLowerCase()
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  const user = await verifyUserAuth(req)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // Call ThirdWeb Insight API directly
    //console.log(process.env.THIRDWEB_CLIENT_ID)
    const response = await fetch(`https://insight.thirdweb.com/v1/tokens?chain_id=8453&limit=50&metadata=true&resolve_metadata_links=true&include_spam=false&owner_address=${address}&include_native=true&clientId=${process.env.THIRDWEB_CLIENT_ID}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('ThirdWeb API error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch from ThirdWeb API' }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return NextResponse.json(data);
    }

    // Get all token addresses
    const tokenAddresses = data.data.map((token: any) => token.token_address);

    // Get prices for all tokens
    const info = await getTokenInfoByAddresses(tokenAddresses);

    // Enhance the data with prices and calculated balances
    const enhancedData = data.data
      .map((token: Token) => {
        // Skip if token is not a virtual agent token
        //if (!isVirtualAgentToken(token.token_address)) return null;

        const priceInfo = info.find(p => p.address.toLowerCase() === token.token_address.toLowerCase());
        const price = priceInfo?.price || 0;
        
        // Skip tokens with zero price
        // if (price === 0) return null;
        
        let imageUrl = '';
        if (token.token_address.toLowerCase() === '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'.toLowerCase()) {
          imageUrl = 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694';
        } else {
          imageUrl = priceInfo?.imageUrl || ''; 
        }

        
        // Calculate balance in USD
        const balanceInWei = BigInt(token.balance);
        const decimals = token.decimals;
        const balanceInEth = Number(balanceInWei) / Math.pow(10, decimals);
        const balanceInUsd = Number((balanceInEth * price).toFixed(2));
        
        // Skip tokens with balance less than $1
        if (balanceInUsd < 1) return null;
        
        return {
          ...token,
          price,
          balanceInUsd,
          imageUrl
        };
      })
      .filter((token: any): token is NonNullable<typeof token> => token !== null);

    // Calculate total ETH balance in USD
    const totalBalanceInUsd = enhancedData.reduce((total: number, token: { balanceInUsd: number }) => total + token.balanceInUsd, 0);

    return NextResponse.json({
      data: enhancedData,
      totalBalanceInUsd
    });
  } catch (error) {
    console.error('Error fetching holdings:', error);
    return NextResponse.json({ error: 'Failed to fetch holdings' }, { status: 500 });
  }
} 