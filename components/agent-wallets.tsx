"use client"

import { useState } from "react"
import Image from "next/image"
import { Twitter, Wallet, Mail, Copy, ExternalLink, X, Loader2, CheckCircle, XCircle, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDelegatedActions, useFundWallet, useHeadlessDelegatedActions, usePrivy, useSolanaWallets, useWallets, WalletWithMetadata } from "@privy-io/react-auth"
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

export default function AgentWallets() {
  const [isConnecting, setIsConnecting] = useState(false)
  const {fundWallet} = useFundWallet()
  const {ready, wallets} = useWallets();
  const {ready: readySolana, wallets: walletsSolana, exportWallet: exportSolanaWallet} = useSolanaWallets();
  const {exportWallet, user} = usePrivy();
  const {delegateWallet} = useHeadlessDelegatedActions();
  const {revokeWallets} = useDelegatedActions();


  if (!ready || !readySolana) {
    return (
        <Loader2 className="w-4 h-4 animate-spin" />
    )
  }

  const evmWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
  const isAlreadyDelegated = !!user?.linkedAccounts.find(
    (account): account is WalletWithMetadata => account.type === 'wallet' && account.address === evmWallet?.address && account.delegated,
  );

  const solanaWallet = walletsSolana.find((wallet) => wallet.walletClientType === 'privy');
  const isAlreadyDelegatedSolana = !!user?.linkedAccounts.find(
    (account): account is WalletWithMetadata => account.type === 'wallet' && account.address === solanaWallet?.address && account.delegated,
  );

  console.log('isAlreadyDelegated', isAlreadyDelegated);
  console.log('isAlreadyDelegatedSolana', isAlreadyDelegatedSolana);

  const onDelegate = async () => {
    setIsConnecting(true)
    await delegateWallet({address: evmWallet?.address as string, chainType: 'ethereum'}); // or chainType: 'ethereum'
    await delegateWallet({address: solanaWallet?.address as string, chainType: 'solana'}); // or chainType: 'ethereum'
    setIsConnecting(false)
  };

  const onRevoke = async () => {
    await revokeWallets();
  };


  const handleDelegation = async () => {
    setIsConnecting(true)
    // Implement delegation logic here
    setTimeout(() => setIsConnecting(false), 1000)
    await delegateWallet({address: evmWallet?.address as string, chainType: 'ethereum'}); // or chainType: 'ethereum'
  }

  const handleDelegationSolana = async () => {
    setIsConnecting(true)
    // Implement delegation logic here
    setTimeout(() => setIsConnecting(false), 1000)
    await delegateWallet({address: solanaWallet?.address as string, chainType: 'solana'}); // or chainType: 'ethereum'
  }

  return (
      <div className="space-y-6">
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
                  {evmWallet?.address ? 
                  <Link href={`https://basescan.org/address/${evmWallet.address}`} target="_blank" className="flex items-center gap-1">
                    {evmWallet.address}
                    <ExternalLink className="w-4 h-4" />
                  </Link> : 
                  "Not connected"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button disabled size="sm" 
                  onClick={() => fundWallet(evmWallet?.address as string, {
                  chain: base,
                  amount: "50",
                  card: {
                    preferredProvider: 'moonpay',
                  },
                })}>
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Add Funds
                </div>
              </Button>

              <Button disabled variant="secondary" size="sm" 
                onClick={() => exportWallet({address: evmWallet?.address as string})}>
                Export Private Key
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6">
                <Image src="/img/sol.svg" alt="Solana" width={24} height={24} />
              </div>
              <div className="flex flex-col">
                <span className="">Solana Wallet</span>
                <span className="text-sm text-muted-foreground font-mono">
                  {solanaWallet?.address ?
                  <Link href={`https://solscan.io/address/${solanaWallet.address}`} target="_blank" className="flex items-center gap-1">
                    {solanaWallet.address}
                    <ExternalLink className="w-4 h-4" />
                  </Link> : 
                  "Not connected"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" disabled>
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Add Funds
                </div>
              </Button>

              <Button variant="secondary" size="sm" disabled>
                Export Private Key
              </Button>
              </div>
          </div>

        <div className="pt-4">
          <h3 className="text-lg font-light">What is Delegated Access?</h3>
            <p className="text-sm text-white mt-2">
              Delegated access allows your Ethy AI agent to perform transactions on your behalf without requiring manual signature approval each time. This is improve users experience for and is required for execute automated tasks.
            </p>
            <div className="mt-4 flex gap-3 items-center">
              {!isAlreadyDelegated? 
              <Button variant="outline" size="sm" onClick={onDelegate} disabled={isConnecting || isAlreadyDelegated}>
                Enable Delegation
              </Button>
              : <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <p className="text-sm text-muted-foreground">Delegation is already enabled</p>
              </div>
              }
              {isAlreadyDelegated? 
              <Link href="#" className="border-red-800 text-red-700 text-xs hover:underline" onClick={onRevoke}>
                Revoke All
              </Link>
              : 
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-500">Delegation is required to use My Agent capabilities</p>
              </div>
              }
            </div>
          </div>
        </>
      )}
    </div>
  )
}