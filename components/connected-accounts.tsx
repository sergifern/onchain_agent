"use client"

import { useState } from "react"
import Image from "next/image"
import { Twitter, Wallet, Mail, Copy, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDelegatedActions, useFundWallet, useLinkAccount, usePrivy } from "@privy-io/react-auth"
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
  subject: string
}

type Account = WalletAccount | EmailAccount | TwitterAccount

export default function ConnectedAccounts() {
  const [isConnecting, setIsConnecting] = useState(false)
  const {fundWallet} = useFundWallet()
  const {delegateWallet} = useDelegatedActions();
  const {user, ready, authenticated, unlinkTwitter} = usePrivy()



  const {linkTwitter, linkEmail} = useLinkAccount({
    onSuccess: ({user, linkMethod, linkedAccount}) => {
      console.log(user, linkMethod, linkedAccount);
      // Any logic you'd like to execute if the user successfully links an account while this
      // component is mounted
    },
    onError: (error, details) => {
      console.log(error, details);
      // Any logic you'd like to execute after a user exits the link flow or there is an error
    },
  }); 


  if (!user) return null
  if (!ready) return (
      <Loader2 className="w-4 h-4 animate-spin" />
  )
  const accounts = user?.linkedAccounts


  const mainAccount = accounts?.find(
    (acc) => (acc.type === "wallet" && acc.connectorType !== "embedded") || acc.type === "email",
  )
  const twitterAccount = accounts?.find((acc) => acc.type === "twitter_oauth") as TwitterAccount | undefined
  
  /*const handleTwitterConnect = async () => {
    setIsConnecting(true)
    await linkTwitter()
    setTimeout(() => setIsConnecting(false), 1000)
  }*/

  const handleTwitterDisconnect = async () => {
    setIsConnecting(true)
    //await unlinkTwitter()
    setTimeout(() => setIsConnecting(false), 1000)
  }
  console.log(twitterAccount)

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
        {renderMainAccount()}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6">
              <Image src="/img/x.svg" alt="X" width={24} height={24} />
            </div>
            <div className="flex flex-col">
              <span className="">X (Twitter)</span>
              {twitterAccount?.username && (
                <span className="text-sm text-muted-foreground">@{twitterAccount.username}</span>
              )}
            </div>
          </div>
          {twitterAccount ? (
            <Button
              variant="ghost"
              className="text-red-700 hover:text-red-500"
              size="sm"
              onClick={() => unlinkTwitter(twitterAccount?.subject as string)}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={linkTwitter}
              disabled={isConnecting}
            >
              Connect
            </Button>
          )}
        </div>
        <div className="hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="">Email</span>
            </div>
          </div>
          {twitterAccount ? (
            <Button
              variant="destructive"
              size="sm"
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
            >
              Connect
            </Button>
          )}
        </div>
    </div>
  )
}

