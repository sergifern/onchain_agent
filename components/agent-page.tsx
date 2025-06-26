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
import PageLoader from "./page-loader";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import SheetGuide from "./sheet-guide";
import AgentInfoTabs from "./agent-tabs";
import { getStakedBalance } from "@/lib/virtuals/utils";
import { DeployAnimation } from "./deploy-animation";
import { useRouter } from "next/navigation";
import { useEmbeddedWallet, useEmbeddedWalletAddress, useEmbeddedWalletDelegated, useEmbeddedWalletStatus } from "@/lib/agent/utils";


export default function AgentPage() {
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
   

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

        if (!data.agent) {
          router.push('/agent/deploy');
          setIsLoading(false);
          return;
        } else{ 
          setAgent(data.agent);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error checking agent status:", err);
        setIsLoading(false);
      }
    };

    getAgent();
  }, []);


  if (isLoading) {
    return <PageLoader />;
  }


  return (
    agent ? <>
      <div className="flex flex-col lg:!flex-row gap-4 mb-8">
        <div className="w-full lg:!w-1/2">
          <AgentCard type="Base" />
        </div>
        <Card className="w-full lg:!w-1/2 bg-gradient-to-tr from-[#BE1FF5] via-[#6638ff] to-transparent">
            <CardHeader className="!pb-4">
              <CardTitle className="text-md font-semibold">How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-white/75">
              
              This is your Intelligent Trading Agent, fully automated and linked to your wallet. Ethy AI lets you define Smart Automations to buy, sell, stake or transfer assets—based on your own strategy. You can set up rules like daily staking or DCA (Dollar Cost Averaging) to accumulate tokens over time. Just define the logic, frequency, and intent—Ethy will execute for you. Trade smarter, stay active daily, and farm more points while you sleep.              </p>

              <SheetGuide />
            </CardContent>
          </Card>
      </div>


      <AgentInfoTabs />

      <div className="mt-24">
        <TwitterConnectionCard />
      </div>

    </> : null
  );
}

