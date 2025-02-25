"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Wallet, PlusCircle, MinusCircle, ExternalLink, ChevronDown, Lock, Loader2 } from "lucide-react"
import Image from "next/image"
import { useSolanaWallets } from "@privy-io/react-auth"
import { useFundWallet } from "@privy-io/react-auth"
import { useWallets } from "@privy-io/react-auth"
import { usePrivy } from "@privy-io/react-auth"
import { useHeadlessDelegatedActions, WalletWithMetadata } from "@privy-io/react-auth"
import { useDelegatedActions } from "@privy-io/react-auth"
import Link from "next/link"
import { formatEther } from "viem"
import { useBalance } from "wagmi"

interface Asset {
  symbol: string
  amount: number
  usdValue: number
}

interface AgentCardProps {
  type: "Base" | "Solana"
}

export default function AgentCard({ type }: AgentCardProps) {
  const [isRunning, setIsRunning] = useState(false)
  const isSolana = type === "Solana"
  const [isConnecting, setIsConnecting] = useState(false)
  const {fundWallet} = useFundWallet()
  const {ready, wallets} = useWallets();
  const {ready: readySolana, wallets: walletsSolana, exportWallet: exportSolanaWallet} = useSolanaWallets();
  const {exportWallet, user} = usePrivy();
  const {delegateWallet} = useHeadlessDelegatedActions();
  const {revokeWallets} = useDelegatedActions();


  const evmWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
  /*const isAlreadyDelegated = !!user?.linkedAccounts.find(
    (account): account is WalletWithMetadata => account.type === 'wallet' && account.address === evmWallet?.address && account.delegated,
  );*/
  const solanaWallet = walletsSolana.find((wallet) => wallet.walletClientType === 'privy');

  const { data: ethBalanceData } = useBalance({
    address: evmWallet?.address as `0x${string}`,
    chainId: 8453,
  })
  const ethBalance = (parseFloat(formatEther(ethBalanceData?.value || BigInt(0))) || 0).toFixed(3); 

  // Mock data - replace with real data
  const mainBalance = {
    amount: 0.9,  /// ADD 0.1 ETH
    usdValue: 2422,  // CALCUL USDC
  }

  const otherAssets: Asset[] = [
    { symbol: "USDC", amount: 2500, usdValue: 1404 }, // RESTAR USDC
    { symbol: "ETHY", amount: 3184110, usdValue: 300 }, 
  ]

  const totalAssetsValue = otherAssets.reduce((acc, asset) => acc + asset.usdValue, 0)


  if (!ready || !readySolana) {
    return (
        <Loader2 className="w-4 h-4 animate-spin" />
    )
  }


  if (isSolana) {
    return (
      <Card className="relative overflow-hidden bg-secondary/10">  
        <CardContent className="pointer-events-none p-8">  
        <div className="flex items-center gap-3">
              <div className="w-6 h-6">
                <Image src="/img/sol.svg" alt="Solana" width={24} height={24} /> 
              </div>
              <div className="flex flex-col">
                <span className="">Solana Wallet</span>  
                <span className="hidden text-sm text-muted-foreground font-mono">
                -
                </span>
                <span className="hidden text-sm text-muted-foreground font-mono">
                  {solanaWallet?.address ?
                  <Link href={`https://solscan.io/address/${solanaWallet.address}`} target="_blank" className="flex items-center gap-1">
                    {solanaWallet.address}
                    <ExternalLink className="w-4 h-4" />
                  </Link> : 
                  "Not connected"}
                </span>
              </div>
            </div>
          <div className="absolute inset-0 mt-6 flex items-center justify-center"> 
            <div className="text-center">
              <Lock className="h-8 w-8 text-gray-500 mx-auto" />
              <p className="text-gray-500 mt-2">Coming Soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="[background:linear-gradient(45deg,#282f37,#282f37,#282f37)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.indigo.500)_86%,_theme(colors.indigo.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.slate.600/.48))_border-box] rounded-2xl border border-transparent animate-border">
      <CardHeader className="pb-4 hidden">
        <CardTitle className="flex justify-between items-center">
          <Image src="/img/base-logo.png" alt="Base Logo" width={100} height={250} />
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${isRunning ? "text-emerald-600" : "text-red-500"}`}>
              {isRunning ? "Running" : "Paused"}
            </span>
            <Switch
              checked={isRunning}
              onCheckedChange={setIsRunning}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        {/* Wallet Address Section */}
        <div className="flex items-center gap-4">
          <div className="w-6 h-6">
            <Image src="/img/base.svg" alt="Base" width={24} height={24} />
          </div>
          <div className="flex flex-col">
            <span className="">Base Wallet</span>
            <span className="text-sm text-muted-foreground font-mono">
              {evmWallet?.address ? 
              <Link href={`https://basescan.org/address/${evmWallet.address}`} target="_blank" className="flex items-center gap-1">
                {"0x0eC4...fb78"}
                <ExternalLink className="w-4 h-4" />
              </Link> : 
              "Not connected"}
            </span>
          </div>
        </div>
        <div className="hidden flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-mono">0x0eC4...fb78</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => window.open("https://etherscan.io/address/0x1234...5678", "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Balance and Other Assets Section */}
        <div className="flex justify-between items-center mt-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">MAIN BALANCE</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-light">{mainBalance.amount} ETH</span>
              <span className="text-sm text-gray-500">(${mainBalance.usdValue.toLocaleString()})</span>
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <span className="mr-2">Assets (${totalAssetsValue.toLocaleString()})</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#373d45] border-secondary/50" align="end">
              <div className="space-y-2">
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
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Actions Section */}
        <div className="flex space-x-2 mt-6">
          <Button className="flex-1 flex items-center justify-center h-9">
            <PlusCircle className="mr-2 h-4 w-4" /> Add funds
          </Button>
          <Button className="flex-1 flex items-center justify-center h-9">
            <MinusCircle className="mr-2 h-4 w-4" /> Withdraw
          </Button>
        </div>
      </CardContent>
    </div>
  )
}

