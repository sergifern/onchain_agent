'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Bot } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { usePrivyLogin } from "@/hooks/privy-hooks";
import { useHeadlessDelegatedActions, usePrivy } from "@privy-io/react-auth";
import { getAccessToken } from "@privy-io/react-auth";
import Link from "next/link";
import AgentCard from "@/components/agent-card";
import TwitterConnectionCard from "@/components/twitter-connection-card";
import AgentHoldings from "@/components/agent-holdings";
import PageLoader from "@/components/page-loader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SheetGuide from "@/components/sheet-guide";
import AgentInfoTabs from "@/components/agent-tabs";
import { getStakedBalance } from "@/lib/virtuals/utils";
import { toast } from "@/hooks/use-toast";
import { DeployAnimation } from "@/components/deploy-animation";
import { useRouter } from "next/navigation";
import { useEmbeddedWallet, useEmbeddedWalletAddress, useEmbeddedWalletDelegated, useEmbeddedWalletStatus } from "@/lib/agent/utils";

export default function AgentDeployment() {
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeployAnimation, setShowDeployAnimation] = useState(false);
  const { address } = useAccount();
  const { login } = usePrivyLogin();
  const { ready, authenticated, user } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const router = useRouter();
  const {delegateWallet} = useHeadlessDelegatedActions();
  
  
  // Use the embedded wallet hook
  
  // Example of using additional utility hooks
  const { wallet: embeddedWallet, isAlreadyDelegated, ready: walletReady } = useEmbeddedWalletDelegated();

  const EthyBalance = useBalance({
    address: address,
    token: process.env.NEXT_PUBLIC_ETHY_TOKEN_ADDRESS as `0x${string}`, 
  });

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
        console.log('Agent data', data);
        if (data.agent) {
          router.push('/agent');
          setIsLoading(false);
          return;
        } else{
          setIsLoading(false);
        }

      } catch (err) {
        console.error("Error checking namespace mint status:", err);
        setIsLoading(false);
      }
    };

    getAgent();
  }, []);

  const handleCreateAgent = async () => {
    if (Number(totalBalance) < 1000000 && Number(stakedBalance) < 500000) {
      toast({
        title: "Not enough balance",
        description: "You need either 1,000,000 $ETHY total balance OR 500,000 $ETHY staked to deploy an agent",
      });
      return;
    }
    
    setShowDeployAnimation(true);
    
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(`/api/users/agents`, {
        method: 'POST',
        body: JSON.stringify({
          agent: {
            walletAddress: embeddedWallet?.address,
          },
        }),
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create agent');
      }

      const data = await response.json();
      setAgent(data.agent);
    } catch (error) {
      console.error("Error creating agent:", error);
      toast({
        title: "Failed to create agent",
        description: "Please try again.",
      });
      setShowDeployAnimation(false);
    }
  }

  const handleDeployComplete = () => {
    // Agent creation completed successfully
    console.log("Agent deployment completed");
  }

  const handleRedirect = () => {
    // Redirect to agent page or refresh
    //router.refresh();
    router.push('/agent');
  }

  const handleDelegate = async () => {
    try {
      // Here you would implement the actual delegation logic
      // For now, we'll just simulate a successful delegation
      console.log("Delegating wallet:", embeddedWallet?.address);


      await delegateWallet({address: embeddedWallet?.address as string, chainType: 'ethereum'});
      
      toast({
        title: "Wallet delegated successfully!",
      });
    } catch (error) {
      console.error("Delegation failed:", error);
      toast({
        title: "Failed to delegate wallet",
        description: "Please try again.",
      });
      throw error; // Re-throw to let the animation component handle the error
    }
  }

  useEffect(() => {
    const getStakedEthy = async () => {
      console.log(address);
      const stakedBalance = await getStakedBalance(address as `0x${string}`, '0x0000000000000000000000000000000000000000'); //TODO
      console.log(stakedBalance);
      return stakedBalance;
    }
    getStakedEthy().then((stakedBalance) => {
      setStakedBalance(stakedBalance);
      setTotalBalance(Number(EthyBalance.data?.formatted) + Number(stakedBalance) || 0);
    });
  }, [user?.id, address]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (showDeployAnimation) {
    return (
      <div className="flex flex-col items-center justify-center mt-12 max-w-xl mx-auto">
        <DeployAnimation 
          onComplete={handleDeployComplete}
          onRedirect={handleRedirect}
          onDelegate={handleDelegate}
        />
      </div>
    );
  }

    return (
      <div className="flex flex-col items-center justify-center mt-12 max-w-xl mx-auto gap-4">
        <span className="pb-2 text-lg font-semibold text-muted-foreground">500,000 $ETHY staked OR 1M $ETHY total balance required</span>
        <div className="flex flex-row items-baseline gap-2">
          <h2 className="text-3xl font-extrabold">Run your own Agent</h2>
        </div>
        <p className="mt-2 text-sm text-center mb-4">
          Deploy your agent to let Ethy run your crypto tasks for you. Automate trading and staking of Genesis Agents while you spend your time Yapping!
        </p>
        {!authenticated ? (
          <Button disabled={disableLogin} onClick={login} className="mt-6">
            Connect
          </Button>
        ) : (Number(totalBalance) < 1000000 && Number(stakedBalance) < 500000) ? (
          <div className="flex flex-col items-center gap-2">
            <Button disabled className="mt-6">
              Not Enough Balance
            </Button>
            <Link href="/swap" className="text-sm text-violeta hover:text-violeta/80 hover:underline">
              Buy $ETHY
            </Link>
          </div>
        ) : (
          <Button onClick={handleCreateAgent} disabled={isCreating}>
            <Bot className="w-4 h-4" />
            {isCreating ? "Creating..." : "Deploy Agent"}
          </Button>
        )}

        <div className="flex flex-row gap-2">
          <p className="text-sm text-muted-foreground">Wallet: {Number(EthyBalance.data?.formatted).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-sm text-muted-foreground">Staked: {Number(stakedBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-sm text-muted-foreground">Total: {Number(totalBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

      </div>  
    );
}

