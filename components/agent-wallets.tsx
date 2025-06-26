"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Twitter, Wallet, Mail, Copy, ExternalLink, X, Loader2, CheckCircle, XCircle, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDelegatedActions, useFundWallet, useHeadlessDelegatedActions, usePrivy, useSolanaWallets, useWallets, WalletWithMetadata } from "@privy-io/react-auth"
import { base } from "viem/chains"
import Link from "next/link"
import { toast, useToast } from "@/hooks/use-toast"
import { getAccessToken } from "@privy-io/react-auth"


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
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getAgent = async () => {
      try {
        setIsLoading(true);
        const accessToken = await getAccessToken();
        const response = await fetch(`/api/users/agents`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        setAgent(data.agent);
        setIsLoading(false);
      } catch (err) {
        console.error("Error checking namespace mint status:", err);
      }
    };

    getAgent();
  }, []);

  if (!ready || !readySolana || isLoading) {
    return (
        <Loader2 className="w-4 h-4 animate-spin" />
    )
  }

  const evmWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
  const isAlreadyDelegated = !!user?.linkedAccounts.find(
    (account): account is WalletWithMetadata => account.type === 'wallet' && account.address === evmWallet?.address && account.delegated,
  );

  //const solanaWallet = walletsSolana.find((wallet) => wallet.walletClientType === 'privy');
  //const isAlreadyDelegatedSolana = !!user?.linkedAccounts.find(
  //  (account): account is WalletWithMetadata => account.type === 'wallet' && account.address === solanaWallet?.address && account.delegated,
  //);
  const solanaWallet = null;

  const onDelegate = async () => {
    setIsConnecting(true)
    await delegateWallet({address: evmWallet?.address as string, chainType: 'ethereum'}); // or chainType: 'ethereum'
    //await delegateWallet({address: solanaWallet?.address as string, chainType: 'solana'}); // or chainType: 'ethereum'
    toast({
      description: "Delegation is now enabled",
    })
    setIsConnecting(false)
  };

  const onRevoke = async () => {
    await revokeWallets();
  };



  if (!agent) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-md text-muted-foreground">
          Agent not deployed, first <Link href="/agent" className="text-violeta hover:underline hover:text-violeta/80">create your agent</Link>
        </p>
      </div>
    )
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
              <Button size="sm"
                  onClick={() => fundWallet(evmWallet?.address as string, {
                  chain: base,
                  amount: "0.1",
                })}>
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Add Funds
                </div>
              </Button>

              <Button variant="secondary" size="sm" 
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
                  "Not available yet"}
                </span>
              </div>
            </div>
            <div className="hidden flex items-center gap-3">
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
            Delegated access allows your Ethy AI agent to perform transactions on your behalf without requiring manual signature approval each time. This enhances the user experience and is essential for executing automated tasks — Ethy is working for you while you rest!</p>
            <div className="mt-4 flex gap-3 items-center">
              {!isAlreadyDelegated? 
              <Button className="button-filled" size="sm" onClick={onDelegate} disabled={isConnecting || isAlreadyDelegated}>
                Enable Delegation
              </Button>
              : <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <p className="text-sm text-muted-foreground">Delegation enabled</p>
              </div>
              }
              {isAlreadyDelegated? 
              <Link href="#" className="border-red-800 text-red-700 text-xs hover:underline" onClick={onRevoke}>
                Revoke All
              </Link>
              : 
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-violeta" />
                <p className="text-sm text-violeta">Delegation is required to use My Agent capabilities</p>
              </div>
              }
            </div>
          </div>
        </>
      )}
    </div>
  )
}