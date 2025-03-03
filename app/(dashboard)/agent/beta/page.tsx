"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AgentCard from "@/components/agent-card"
import TasksTab from "@/components/tasks-tab"
import ExecutionHistory from "@/components/execution-history"
import TransactionsTab from "@/components/transactions-tab"
import { Moon, Sun, Twitter, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import Image from "next/image"
export default function Home() {
  const [activeTab, setActiveTab] = useState("tasks")
  const [darkMode, setDarkMode] = useState(false)
  const [twitterConnected, setTwitterConnected] = useState(false)

  const handleTwitterConnect = () => {
    setTwitterConnected(!twitterConnected)
  }

  return (
    <main className="container p-4 ml-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">My Agent</h1>
      </div>


      {/* Sección de Agentes */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <AgentCard type="Base"/>
        <AgentCard type="Solana"/>
      </div>

      <div className="[background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.indigo.500)_86%,_theme(colors.indigo.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.slate.600/.48))_border-box] rounded-2xl border border-transparent animate-border">
                <CardContent>
                    <CardHeader>
                        <CardTitle>
                            <h2>Card</h2>
                        </CardTitle>
                    </CardHeader>
                </CardContent>                  
            </div>
            
      {/* Twitter Connection Card */}
      <Card className="mb-3 border-none">
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
      <Card className="mb-6 border-none">
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

      {/* Sección de Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">
            <span className="flex items-center">
            <ListTodo className="h-5 w-5 mr-2" />
              Tasks
            </span>
          </TabsTrigger>
          <TabsTrigger value="execution">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20v-6M6 20V10M18 20V4" />
              </svg>
              Execution History
            </span>
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Transactions
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <TasksTab />
        </TabsContent>
        <TabsContent value="execution">
          <ExecutionHistory />
        </TabsContent>
        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>
      </Tabs>
    </main>
  )
}

