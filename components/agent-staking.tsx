import { useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { Loader2 } from "lucide-react"
import TokenCard from "./token-card"

interface Holding {
  chain_id: number
  token_address: string
  owner_address: string
  balance: string
  balanceInUsd: number
  decimals: number
  imageUrl: string
  name: string
  price: string
  symbol: string
  fdv?: number
}

export default function AgentStaking({ stakingPositions, isLoading }: { stakingPositions: Holding[], isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stakingPositions || stakingPositions.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No assets found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl text-muted-foreground">Staking Positions</h1>
      <h2 className="text-md text-muted-foreground">Total value: <span className="font-bold text-primary">${stakingPositions.reduce((acc, holding) => acc + holding.balanceInUsd, 0).toLocaleString()}</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stakingPositions.map((holding) => (
          <TokenCard
            key={holding.token_address}
            token_address={holding.token_address}
            name={holding.name}
            symbol={holding.symbol}
            imageUrl={holding.imageUrl}
            price={holding.price}
            fdv={holding.fdv}
            balance={holding.balance}
            decimals={holding.decimals}
            balanceInUsd={holding.balanceInUsd}
          />
        ))}
      </div>
    </div>
  )
}