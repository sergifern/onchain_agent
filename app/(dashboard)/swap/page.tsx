"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {useAccount} from 'wagmi';
import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { 
  SwapDefault,
  Swap, 
  SwapAmountInput, 
  SwapToggleButton, 
  SwapButton, 
  SwapMessage, 
  SwapToast, 
} from '@coinbase/onchainkit/swap';
import type { Token } from '@coinbase/onchainkit/token';
import { Buy } from '@coinbase/onchainkit/buy';
import PageContainer from '@/components/page-container';


const ethy: Token = {
  name: 'Ethy AI',
  address: '0xC44141a684f6AA4E36cD9264ab55550B03C88643',
  symbol: 'ETHY',
  decimals: 18,
  image:
    '/img/ethy-icon.png',
  chainId: 8453,
};
 
const virtual: Token = {
  name: 'Virtual',
  address: '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b',
  symbol: 'VIRTUAL',
  decimals: 18,
  image:
    'https://basescan.org/token/images/virtualprotocol_32.png',
  chainId: 8453,
};

const usdc: Token = {
  name: 'USDC',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: 8453,
};

const eth: Token = {
  name: 'Ethereum',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image: "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
  chainId: 8453,
};

const swappableTokens: Token[] = [usdc, virtual];


export default function SwapPage() {
  const { logout, user } = usePrivy()


  return (
    <PageContainer title="Swap" description="Swap tokens to get more ETHY and use it on the platform">
      <div className="mx-auto max-w-md mt-12">
        <Swap
        experimental={{
          useAggregator: true,
        }}
        title="Buy Ethy AI tokens"
        >
          <SwapAmountInput
            label="Sell"
            token={usdc}
            swappableTokens={swappableTokens}
            type="from"
          />
          <SwapAmountInput
            label="Buy"
            token={ethy}
            type="to"
          />
          <SwapButton/>
          <SwapMessage />
          <SwapToast />
        </Swap> 
      </div>
    </PageContainer>
  )
}