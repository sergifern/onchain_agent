'use client'

import AgentCard from "@/components/agent-card";
import PageContainer from "@/components/page-container"
import { WaitlistCheck } from "@/components/waitlist-check"
import { Flame } from "lucide-react"
import { useEffect, useState   } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TasksTab from "@/components/tasks-tab"
import ExecutionHistory from "@/components/execution-history"
import TransactionsTab from "@/components/transactions-tab"
import { Moon, Sun, Twitter, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import AgentTable from "@/components/agent-table";
import { Loader2 } from "lucide-react"; 

export default function ComingSoon() {
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/agent")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsOnWaitlist(data.status);
        setIsLoading(false);
      });
  }, []);

  return (
    <PageContainer title="My Agent" description="Handle your own AI agent to automate your tasks">
      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-12 max-w-md mx-auto">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

      {!isLoading && !isOnWaitlist && (
        <div className="flex flex-col items-center justify-center mt-12 max-w-md mx-auto">
          <span className="pb-2 text-lg font-semibold text-muted-foreground">3m $ETHY required</span>
          <div className="flex flex-row items-baseline gap-2">
          <Flame className="w-8 h-8" />
          <h2 className="text-3xl font-extrabold">Coming Soon</h2>
        </div>
        <p className="mt-2 text-sm text-center">
          We&apos;re open access progressivly to this feature, get ready to be there soon.
          Join our waitlist to be the next!
        </p>
        <WaitlistCheck />
        </div>
        )
        }
      {!isLoading && isOnWaitlist && (
          <Agent />
      )}
    </PageContainer>
  )
}


const Agent = () => {
  const [activeTab, setActiveTab] = useState("tasks")
  const [twitterConnected, setTwitterConnected] = useState(false)
  const [eyeFutureConnected, setEyeFutureConnected] = useState(false)

  const handleTwitterConnect = () => {
    setTwitterConnected(!twitterConnected)
  }
  return (
    <div>


    {/* Sección de Agentes */}
    <div className="flex flex-col lg:!flex-row gap-4 mb-12">
      <div className="w-full lg:!w-1/2">
          <AgentCard type="Base" />
        </div>
        <div className="w-full lg:!w-1/2">
          <AgentCard type="Solana" />
        </div>
    </div>


          
    {/* Twitter Connection Card */}
    <Card className="hidden mb-3 border-none">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {/* Círculo con logo de X */}
          <div className="mr-4 bg-black rounded-full p-2 w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-md ">X Integration</h2>
            <p className="text-sm text-secondary">
              {twitterConnected
                ? "Your Agent can now post updates to Twitter."
                : "Connect your profile to buy, sell, transfer, or create tasks on X by simply interacting with @ethy_agent."}
            </p>
          </div>
        </div>
        <Button
          variant={twitterConnected ? "outline" : "default"}
          onClick={handleTwitterConnect}
          className="flex items-center"
        >
          {twitterConnected ? "Disconnect Twitter" : "Connect Profile"}
        </Button>
      </CardContent>
    </Card>

    {/* Eye Future Connection Card */}
    <Card className="hidden mb-6 border-none">
      <CardContent className="flex items-center justify-between p-4 border-none">
        <div className="flex items-center">
          {/* Círculo con logo de X */}
            <Image src="/img/eyefuture.jpg" alt="Eye Future Logo" width={50} height={50} className="mr-4 rounded-full" />
          <div>
            <h2 className="text-md">Eye Future Forecast</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {twitterConnected
                ? "Your Agent can now post updates to Twitter."
                : "Link your account to receive market forecasts that you can fully automate with your Agent."}
            </p>
          </div>
        </div>
        <Button
          variant={twitterConnected ? "outline" : "default"}
          onClick={handleTwitterConnect}
          className="flex items-center"
        >
          {twitterConnected ? "Disconnect Twitter" : "Link Account"}
        </Button>
      </CardContent>
    </Card>

    <AgentTable />
  </div>
  )
}