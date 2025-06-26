'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ListTodo, Plus, Pencil, Trash2, Power, Coins } from "lucide-react"
import { useState } from "react"
import TasksTab from "./tasks-tab"
import ExecutionHistory from "./execution-history"
import TransactionsTab from "./transactions-tab"
import Link from "next/link"
import { useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import AgentHoldings from "./agent-holdings"
import AgentStaking from "./agent-staking"
import { useEmbeddedWalletDelegated } from "@/lib/agent/utils"

interface Holding {
  chain_id: number
  token_address: string
  owner_address: string
  balance: string
  balanceInUsd: number
  decimals: number
  imageUrl: string
  name: string
  price: string
  symbol: string
  fdv?: number
}

export default function AgentInfoTabs() {
  const { getAccessToken } = usePrivy()
  const [activeTab, setActiveTab] = useState("balances")
  const [tasks, setTasks] = useState([])


  const { wallet: embeddedWallet, isAlreadyDelegated, ready: walletReady } = useEmbeddedWalletDelegated();
  
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [stakingPositions, setStakingPositions] = useState<Holding[]>([])


  useEffect(() => {
    const fetchHoldings = async () => {
      setIsLoading(true)
      try {
        const accessToken = await getAccessToken()
        if (!accessToken) {
          return
        }
        const response = await fetch(`/api/users/agents/holdings?address=${embeddedWallet?.address}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const data = await response.json()
        const holdings = data.data
          .filter((holding: Holding) => parseFloat(holding.price) > 0)
          .sort((a: Holding, b: Holding) => b.balanceInUsd - a.balanceInUsd)
        setHoldings(holdings)
      } catch (error) {
        console.error('Error fetching holdings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHoldings()
  }, [embeddedWallet?.address])

  useEffect(() => {
    const fetchHoldings = async () => {
      setIsLoading(true)
      try {
        const accessToken = await getAccessToken()
        if (!accessToken) {
          return
        }
        const response = await fetch(`/api/users/agents/staking?address=${embeddedWallet?.address}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const data = await response.json()
        const stakingPositions = data.data
          .filter((holding: Holding) => parseFloat(holding.price) > 0)
          .sort((a: Holding, b: Holding) => b.balanceInUsd - a.balanceInUsd)
        setStakingPositions(stakingPositions)
        //console.log(stakingPositions)
      } catch (error) {
        console.error('Error fetching holdings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHoldings()
  }, [embeddedWallet?.address])


  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center">
        <TabsList className="">
            <TabsTrigger value="balances">
            <span className="flex items-center">
              <Coins className="h-5 w-5 mr-2" />
              Token Holdings
            </span>
          </TabsTrigger>
          <TabsTrigger value="staking">
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
              Staking Positions
            </span>
          </TabsTrigger>
          <TabsTrigger value="cashbacks">
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
              Cashbacks
            </span>
          </TabsTrigger>
        </TabsList>
        <Link href="/agent/tasks/add" className="flex px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Automation
        </Link>
      </div>
      <TabsContent value="balances">
        <div className="mt-6">
          <AgentHoldings holdings={holdings} isLoading={isLoading} />
        </div>
      </TabsContent>
      <TabsContent value="staking">
        <div className="mt-6">
          <AgentStaking stakingPositions={stakingPositions} isLoading={isLoading} />
        </div>
      </TabsContent>
      <TabsContent value="cashbacks">
        <div className="flex items-center mt-12 gap-2">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Under development.
            
          This section will soon display your cashback rewards. We're already tracking your $ETHY trading volume and Smart Automations that use $ETHY as the base currency — so no worries, everything is being counted! Payouts will begin rolling out in the coming days.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
