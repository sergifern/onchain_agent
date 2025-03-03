"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi";
import LinkedAccounts from "@/components/linked-accounts";
import PageContainer from "@/components/page-container";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ConnectedAccounts from "@/components/connected-accounts";
import AgentWallets from "@/components/agent-wallets";

export default function Settings() {
  const { logout, user, ready, authenticated } = usePrivy()
  const {address} = useAccount();

  return (
    <PageContainer title="Settings" description="Manage your account settings">
      <h2 className="text-xl mb-6 text-secondary flex items-center gap-2">
        Connected Accounts
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent className="border-none">
            <p>All your verified accounts that allow you to login to your Ethy AI dashboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>  
      </h2>
      <Card className="card-outline">
        <CardContent className="pt-6">
        <ConnectedAccounts />
        </CardContent>
      </Card>

      <h2 className="text-xl mb-6 text-secondary flex items-center gap-2 mt-10">
        Agent Wallets
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent className="border-none">
            <p>All your Agent wallets that can be used for all onchain operations</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>  
      </h2>
      <Card className="card-outline">
        <CardContent className="pt-6">
          <AgentWallets />
        </CardContent>
      </Card>


      <h2 className="hidden text-xl mb-6 text-secondary flex items-center gap-2 mt-10">
        Credit Balance (and Tier)
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent className="border-none">
            <p>All your Agent wallets that can be used for all onchain operations</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>  
      </h2>
      <Card className="hidden card-outline">
        <CardContent className="pt-6">
          <AgentWallets />
        </CardContent>
      </Card>
    </PageContainer>
  )
}

