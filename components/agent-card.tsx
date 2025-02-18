"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Wallet, PlusCircle, MinusCircle, ExternalLink, ChevronDown, ChevronUp, Lock, Twitter } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Image from "next/image"
interface Asset {
  symbol: string
  amount: number
  usdValue: number
}

interface AgentCardProps {
  type: "Base" | "Solana"
  twitterConnected: boolean
}

export default function AgentCard({ type, twitterConnected }: AgentCardProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const isSolana = type === "Solana"

  // Mock data - replace with real data
  const mainBalance = {
    amount: 3.182,
    usdValue: 8601.0,
  }

  const otherAssets: Asset[] = [
    { symbol: "USDT", amount: 5000, usdValue: 5000 },
    { symbol: "USDC", amount: 2500, usdValue: 2500 },
    { symbol: "WETH", amount: 1.5, usdValue: 4070.16 },
  ]

  const totalAssetsValue = otherAssets.reduce((acc, asset) => acc + asset.usdValue, 0)

  if (isSolana) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="">
          <CardTitle className="flex justify-between items-center">
            <Image src="/img/solana-logo.png" alt="Solana Logo" width={150} height={250} />
          </CardTitle>
        </CardHeader>
        <CardContent className="pointer-events-none space-y-6">
          {/* Contenido difuminado */}
          <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Lock className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-gray-500 mt-2">Solana Coming Soon</p>
          </div>
        </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <Image src="/img/base-logo.png" alt="Base Logo" width={100} height={250} />
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${isRunning ? "text-emerald-600" : "text-red-500"}`}>
              {isRunning ? "Running" : "Paused"}
            </span>
            <Switch checked={isRunning} onCheckedChange={setIsRunning} className="data-[state=checked]:bg-emerald-600" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">


        {/* Wallet Address Section */}
        <div className="flex items-baseline">
          <div className="flex items-baseline">
            <Wallet className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-mono">0x0eC4...fb78</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => window.open("https://etherscan.io/address/0x1234...5678", "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Balance Section */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">MAIN BALANCE</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-semibold">{mainBalance.amount.toFixed(3)} ETH</span>
            <span className="text-sm text-gray-500">(${mainBalance.usdValue.toLocaleString()})</span>
          </div>
        </div>

        {/* Other Assets Section */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">OTHER ASSETS</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <span className="mr-2">${totalAssetsValue.toLocaleString()}</span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-2 mt-2">
            {otherAssets.map((asset) => (
              <div
                key={asset.symbol}
                className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded"
              >
                <div>
                  <div className="font-medium">{asset.symbol}</div>
                  <div className="text-sm text-gray-500">{asset.amount.toFixed(2)} tokens</div>
                </div>
                <div className="text-right">
                  <div>${asset.usdValue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Actions Section */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" className="flex-1 flex items-center justify-center">
            <PlusCircle className="mr-2 h-4 w-4" /> Add funds
          </Button>
          <Button variant="outline" className="flex-1 flex items-center justify-center">
            <MinusCircle className="mr-2 h-4 w-4" /> Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

