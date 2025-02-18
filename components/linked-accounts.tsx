"use client"

import { useState } from "react"
import Image from "next/image"
import { Twitter, Wallet, Mail, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDelegatedActions, useFundWallet, usePrivy } from "@privy-io/react-auth"
import { base } from "viem/chains"
import Link from "next/link"


interface BaseAccount {
  type: string
  delegated?: boolean
  walletClientType?: string
  connectorType?: string
  chainType?: string
}

interface WalletAccount extends BaseAccount {
  type: "wallet"
  address: string
}

interface EmailAccount extends BaseAccount {
  type: "email"
  address: string
  email: string
}

interface TwitterAccount extends BaseAccount {
  type: "twitter_oauth"
  username?: string
  address: string
}

type Account = WalletAccount | EmailAccount | TwitterAccount

export default function LinkedAccounts({ accounts, wallets }: { accounts: Account[], wallets?: boolean }) {
  const [isConnecting, setIsConnecting] = useState(false)
  const {fundWallet} = useFundWallet()
  const {delegateWallet} = useDelegatedActions();


  const mainAccount = accounts.find(
    (acc) => (acc.type === "wallet" && acc.connectorType !== "embedded") || acc.type === "email",
  )
  const twitterAccount = accounts.find((acc) => acc.type === "twitter_oauth") as TwitterAccount | undefined
  
  const embeddedWalletEthereum = accounts.find((acc) => acc.type === "wallet" && acc.connectorType === "embedded" && acc.chainType === "ethereum") as
    | WalletAccount
    | undefined
  const embeddedWalletSolana = accounts.find((acc) => acc.type === "wallet" && acc.connectorType === "embedded" && acc.chainType === "solana") as
    | WalletAccount
    | undefined

  const handleDelegation = async () => {
    setIsConnecting(true)
    // Implement delegation logic here
    setTimeout(() => setIsConnecting(false), 1000)
    await delegateWallet({address: embeddedWalletEthereum?.address as string, chainType: 'ethereum'}); // or chainType: 'ethereum'
  }

  const handleDelegationSolana = async () => {
    setIsConnecting(true)
    // Implement delegation logic here
    setTimeout(() => setIsConnecting(false), 1000)
    await delegateWallet({address: embeddedWalletSolana?.address as string, chainType: 'solana'}); // or chainType: 'ethereum'
  }

  const handleTwitterConnect = async () => {
    setIsConnecting(true)
    // Implement Twitter connect logic here
    setTimeout(() => setIsConnecting(false), 1000)
  }

  const renderMainAccount = () => {
    if (!mainAccount) return null

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6">
            {mainAccount.type === "wallet" ? (
              <Image
                src="/img/metamask.svg"
                alt="Metamask"
                width={24}
                height={24}
              />
            ) : (
              <Mail className="w-6 h-6 text-primary" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="">{mainAccount.type === "wallet" ? "Wallet" : "Email"}</span>
            <span className="text-sm text-muted-foreground font-mono">
              {mainAccount.address}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
      <div className="space-y-6">

        {!wallets && (
          <>
          {renderMainAccount()}
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6">
              <Image src="/img/x.svg" alt="X" width={24} height={24} />
            </div>
            <div className="flex flex-col">
              <span className="">X (Twitter)</span>
              {twitterAccount?.username && (
                <span className="text-xs text-muted-foreground">@{twitterAccount.username}</span>
              )}
            </div>
          </div>
          <Button
            variant={twitterAccount ? "destructive" : "outline"}
            size="sm"
            onClick={handleTwitterConnect}
            disabled={isConnecting}
          >
            {twitterAccount ? "Disconnect" : "Connect"}
          </Button>
        </div>
        </>
        )}

        {/* Embedded Wallet */}
        {wallets && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6">
              <Image src="/img/base.svg" alt="Base" width={24} height={24} />
            </div>
            <div className="flex flex-col">
              <span className="">Base Wallet</span>
              <span className="text-sm text-muted-foreground font-mono">
                {embeddedWalletEthereum?.address ? 
                <Link href={`https://basescan.org/address/${embeddedWalletEthereum.address}`} target="_blank" className="flex items-center gap-1">
                  {embeddedWalletEthereum.address}
                  <ExternalLink className="w-4 h-4" />
                </Link> : 
                "Not connected"}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" 
            onClick={() => fundWallet(embeddedWalletEthereum?.address, {
              chain: base,
              amount: 30,
              card: {
                preferredProvider: 'moonpay',
              },
            })}>
            Funding
          </Button>

          <Button variant="outline" size="sm" 
            onClick={() => fundWallet(embeddedWalletEthereum?.address, {
              chain: base,
              amount: 30,
              card: {
                preferredProvider: 'moonpay',
              },
            })}>
            Export Private Key
          </Button>

          {embeddedWalletEthereum?.delegated ? (
            <Button variant="outline" className="border-red-400/40 text-red-400/40" size="sm" onClick={handleDelegation} disabled={isConnecting}>
              Revoke delegation
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleDelegation} disabled={isConnecting}>
              Enable delegation
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6">
              <Image src="/img/sol.svg" alt="Solana" width={24} height={24} />
            </div>
            <div className="flex flex-col">
              <span className="">Solana Wallet</span>
              <span className="text-sm text-muted-foreground font-mono">
                {embeddedWalletSolana?.address ?
                <Link href={`https://solscan.io/address/${embeddedWalletSolana.address}`} target="_blank" className="flex items-center gap-1">
                  {embeddedWalletSolana.address}
                  <ExternalLink className="w-4 h-4" />
                </Link> : 
                "Not connected"}
              </span>
            </div>
          </div>

          {embeddedWalletSolana?.delegated ? (
            <Button variant="outline" className="border-red-400/40 text-red-400/40" size="sm" onClick={handleDelegation} disabled={isConnecting}>
              Revoke delegation
            </Button>
          ) : (
            <Button variant="outline"  size="sm" onClick={handleDelegationSolana} disabled={isConnecting}>
              Enable delegation
            </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

