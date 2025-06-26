"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Wallet, PlusCircle, MinusCircle, ExternalLink, ChevronDown, Lock, Loader2, CheckCircle, Copy, Info } from "lucide-react"
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
import { base } from "viem/chains"
import { toast } from "@/hooks/use-toast"
import {useSendTransaction} from '@privy-io/react-auth';
import { useEmbeddedWalletAddress, useEmbeddedWalletDelegated } from "@/lib/agent/utils"
import { getTokenPriceBySymbol } from "@/lib/assets/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  const [copiedAddress, setCopied] = useState<string | null>(null)
  const {sendTransaction} = useSendTransaction();
  const [ethyBalanceInUsd, setEthyBalanceInUsd] = useState(0);
  const [ethBalanceInUsd, setEthBalanceInUsd] = useState(0);


  /*const handleSendTransaction = async () => {
    await sendTransaction({
      to: '0xE3070d3e4309afA3bC9a6b057685743CF42da77C',
      value: 100000
    });
  }*/

  const { wallet: embeddedWallet, isAlreadyDelegated, ready: walletReady } = useEmbeddedWalletDelegated();

  const { data: ethyBalanceData } = useBalance({
    address: embeddedWallet?.address as `0x${string}`,
    token: process.env.NEXT_PUBLIC_ETHY_TOKEN_ADDRESS as `0x${string}`, 
  });

  const ethyBalance = (parseFloat(formatEther(ethyBalanceData?.value || BigInt(0))) || 0);


  const { data: ethBalanceData } = useBalance({
    address: embeddedWallet?.address as `0x${string}`,
    chainId: 8453,
  })

  const ethBalance = (parseFloat(formatEther(ethBalanceData?.value || BigInt(0))) || 0); 


  useEffect(() => {
    const getEthyPrice = async () => {
      const ethyPrice = await getTokenPriceBySymbol("ETHY");
      console.log("ethyPrice", ethyPrice);
      console.log("ethyBalance", ethyBalance);
      const ethyBalanceInUsd = ethyBalance * ethyPrice;
      console.log("ethyBalanceInUsd", ethyBalanceInUsd);
      setEthyBalanceInUsd(ethyBalanceInUsd);
    }
    const getEthPrice = async () => {
      const ethprice = await getTokenPriceBySymbol("ETH");
      console.log("ethprice", ethprice);
      console.log("ethBalance", ethBalance);
      const ethBalanceInUsd = ethBalance * ethprice;
      console.log("ethBalanceInUsd", ethBalanceInUsd);
      setEthBalanceInUsd(ethBalanceInUsd);
    }
    getEthyPrice();
    getEthPrice();
  }, [ethyBalance, ethBalance]);


  


  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!ready || !readySolana) {
    return (
        <Loader2 className="w-4 h-4 animate-spin" />
    )
  }


  /*if (isSolana) {
    return (
      <Card className="relative overflow-hidden bg-secondary/10 h-full">  
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
  }*/

  return (
    <div className="[background:linear-gradient(45deg,#323a47,#323a47,#323a47)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,#be1ff5_85%,#6937fe_87%,#4c2ebf_87%,_theme(colors.slate.600/.48))_border-box] rounded-2xl border-2 border-transparent animate-border">
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
          <div className="w-6 h-6 hidden">
            <Image src="/img/base.svg" alt="Base" width={24} height={24} />
          </div>
          <div className="flex flex-col">
            <span className="">Base Wallet</span>
            <span className="text-sm text-secondary font-mono">
              {embeddedWallet?.address ? 
                <div className="flex items-center gap-1">
                  {embeddedWallet.address}
                  <button
                      onClick={() => copyToClipboard(embeddedWallet?.address as string)}
                      className="text-muted-foreground hover:text-secondary transition-colors ml-2 mr-1"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {copiedAddress === embeddedWallet?.address && (
                      <span className="text-xs text-foreground">Copied!</span>
                    )}
                    <Link href={`https://basescan.org/address/${embeddedWallet.address}`} target="_blank" className="flex items-center gap-1 text-muted-foreground hover:text-secondary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                </div> : 
                "Not found"}
            </span>
          </div>
        </div>

        {/* Main Balance and Other Assets Section */}
        <div className="flex justify-start items-center mt-6 gap-8">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">CREDITS BALANCE ($ETHY)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent className="border-none bg-sidebar">
                    <p>ETHY credits are the used to cover transactions executed by your Agent</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>  
            </h3>
            <div className="flex items-center space-x-2">
              <Image src="/img/ETHY_coin_2.png" alt="ETHY" width={24} height={24} className="w-8 h-8" />
              <span className="text-xl font-light">{ethyBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}</span>
                <span className="hidden text-sm text-gray-500">${ethyBalanceInUsd.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}</span>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">ETH BALANCE 
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-light">{ethBalance.toLocaleString(undefined, {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4,
              })}</span>
                <span className="text-sm text-gray-500">${ethBalanceInUsd.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}</span>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex space-x-2 mt-6 items-center">
          <Button size="sm" className=""
              onClick={() => fundWallet(embeddedWallet?.address as string, {
              chain: base ,
              amount: "0.1",
            })}>
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Add Funds
            </div>
          </Button>
          
          <Button size="sm" className="button-outline-secondary"
            //onClick={handleSendTransaction}
          >
            <MinusCircle className="mr-2 h-4 w-4" /> Transfer
          </Button>

          
        </div>
      </CardContent>
    </div>
  )
}

