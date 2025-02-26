"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { cn, truncateAddress } from "@/lib/utils"
import Image from "next/image"
import { usePrivy } from "@privy-io/react-auth"
import { useBalance } from "wagmi"
import { Connection, PublicKey } from "@solana/web3.js"
import { formatEther } from 'viem'

interface WalletAccount {
  type: "wallet"
  address: string
  connectorType?: string
  chainType?: string
}

interface TwitterAccount {
  type: "twitter_oauth"
  username?: string
}

const baseExplorerUrl = "https://basescan.org"
const solanaExplorerUrl = "https://solscan.io"

export default function WalletInfoInline() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [solBalance, setSolBalance] = useState("0.00")
  const { user, ready, authenticated } = usePrivy()

  const embeddedWalletEthereum = user?.linkedAccounts?.find(
    (acc) => acc.type === "wallet" && acc.connectorType === "embedded" && acc.chainType === "ethereum"
  ) as WalletAccount | undefined

  const embeddedWalletSolana = user?.linkedAccounts?.find(
    (acc) => acc.type === "wallet" && acc.connectorType === "embedded" && acc.chainType === "solana"
  ) as WalletAccount | undefined

  const { data: ethBalanceData } = useBalance({
    address: embeddedWalletEthereum?.address as `0x${string}`,
    chainId: 8453,
  })
  const ethBalance = (parseFloat(formatEther(ethBalanceData?.value || BigInt(0))) || 0).toFixed(3);

  //const address = new PublicKey('6GJriXmDF8Y4EZSm4jHTscMFnMhWARpMj9NrNgt1qRyv') //4HBFacbpiyZdpRmfuePKX5tezS8J15dAkffjdJUcLGye
  const update = 0;
  
  useEffect(() => {
    if (!embeddedWalletSolana?.address) return
    const solanaConnection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string) 
    solanaConnection.getBalance(new PublicKey(embeddedWalletSolana?.address)).then((balance) => {
      setSolBalance((balance / 1e9).toFixed(2))
    })
  }, [embeddedWalletSolana?.address])

  if (!user || !ready || !authenticated) {
    return null
  }

  const twitterAccount = user.linkedAccounts.find((acc) => acc.type === "twitter_oauth") as TwitterAccount | undefined

  return (
    <div
      className={cn(
        "w-full border-t border-gray-800",
        isExpanded ? "border-t border-secondary/50" : "border-none"
      )}
    >
      <div className="mx-auto max-w-2xl px-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-3 right-2 h-6 w-6 rounded-full bg-secondary"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>

          <div
            className={`
              grid transform-gpu gap-2 overflow-hidden transition-all duration-200
              ${isExpanded ? "grid-rows-[1fr] py-3" : "grid-rows-[0fr]"}
            `}
          >
            <div className="min-h-0">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                {/* Base Wallet */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Base:</span>
                  {embeddedWalletEthereum?.address ? (
                    <Link
                      href={`${baseExplorerUrl}/address/${embeddedWalletEthereum?.address}`}
                      className="flex items-center gap-1 text-primary hover:underline"
                      target="_blank"
                    >
                      {"0x0eC4...fb78"}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">Not connected</span>
                  )}
                  <span className="font-medium">{"0.5"} ETH</span>
                </div>

                {/* Solana Wallet */}
                <div className="hidden flex items-center gap-2">
                  <span className="text-muted-foreground">Solana:</span>
                  {embeddedWalletSolana?.address ? (
                    <Link
                      href={`${solanaExplorerUrl}/address/${embeddedWalletSolana?.address}`}
                      className="flex items-center gap-1 text-primary hover:underline"
                      target="_blank"
                    >
                      {truncateAddress('6GJriXmDF8Y4EZSm4jHTscMFnMhWARpMj9NrNgt1qRyv')}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">Not connected</span>
                  )}
                  <span className="font-medium">{solBalance} SOL</span>
                </div>

                {/* Twitter Status */}
                <div className="flex items-center gap-2">
                  <Image src="/img/x.svg" alt="X" width={16} height={16} />
                  {twitterAccount ? (
                    <span className="flex items-center gap-2">{twitterAccount.username}</span>
                  ) : (
                    <span className="text-muted-foreground">Not connected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
