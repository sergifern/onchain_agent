import { NextRequest, NextResponse } from 'next/server';
import { getTokenInfoByAddresses } from '@/lib/assets/utils';
import { verifyUserAuth } from '@/lib/privy/users';
import { virtualsAgents } from '@/lib/virtuals/agents';
import { createPublicClient, http, parseAbi } from 'viem'
import { base } from 'viem/chains'
import stakingContracts from '@/lib/virtuals/stakingContracts'

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

function isVirtualAgentToken(tokenAddress: string): boolean {
  return virtualsAgents.some(agent => 
    agent.tokenAddress?.toLowerCase() === tokenAddress.toLowerCase()
  );
}

const client = createPublicClient({
  chain: base,
  transport: http(process.env.RPC_PROVIDER_URL || 'https://base-mainnet.g.alchemy.com/v2/H_QDtIkGZCyFH-y9bzNKDZZgE5XVzjI2')
})

// ERC20 ABI for stakedAmountOf
const erc20Abi = parseAbi(['function stakedAmountOf(address owner) view returns (uint256)'])

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const walletAddress = searchParams.get('address');

  if (!walletAddress) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  const user = await verifyUserAuth(req)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // Prepare multicall requests
    const contracts = stakingContracts.map(stkaddress => ({
      address: stkaddress as `0x${string}`,
      abi: erc20Abi,
      functionName: 'stakedAmountOf',
      args: [walletAddress as `0x${string}`]
    }))

    // Execute multicall
    const results = await client.multicall({
      contracts,
      allowFailure: false
    })

    let data: Token[] = []
    // Process results
    results.forEach((balance, i) => {
      if (balance > 0n) {
        console.log(`🟢 Staked in ${stakingContracts[i]}: ${balance.toString()}`)
        
        // Find the virtual agent that matches this staking contract
        const virtualAgent = virtualsAgents.find(agent => 
          agent.agentStakingContract?.toLowerCase() === stakingContracts[i].toLowerCase()
        )

        if (virtualAgent) {
          data.push({
            token_address: virtualAgent.tokenAddress,
            balance: balance.toString(),
            decimals: 18,
            symbol: virtualAgent.symbol,
            name: virtualAgent.name,
            imageUrl: virtualAgent.imageUrl
          })
        }
      }
    })

    // Get all token addresses for price lookup
    const tokenAddresses = data.map(token => token.token_address)

    // Get prices for all tokens
    const info = await getTokenInfoByAddresses(tokenAddresses);

    // Enhance the data with prices and calculated balances
    const enhancedData = data
      .map((token: Token) => {
        // Skip if token is not a virtual agent token
        if (!isVirtualAgentToken(token.token_address)) return null;

        const priceInfo = info.find(p => p.address.toLowerCase() === token.token_address.toLowerCase());
        const price = priceInfo?.price || 0;
        
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
          imageUrl: priceInfo?.imageUrl || token.imageUrl
        };
      })
      .filter((token: any): token is NonNullable<typeof token> => token !== null);

    // Calculate total ETH balance in USD
    const totalBalanceInUsd = enhancedData.reduce((total: number, token: { balanceInUsd: number }) => total + token.balanceInUsd, 0);

    return NextResponse.json({ 
      data: enhancedData,
      totalBalanceInUsd 
    })
  } catch (error) {
    console.log(error)
    console.error('Error fetching holdings:', error);
    return NextResponse.json({ error: 'Failed to fetch holdings' }, { status: 500 });
  }
} 