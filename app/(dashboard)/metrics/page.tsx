'use client'

import { Flame, DollarSign, PieChart, Users, BarChart3, Clock, Package, Calendar, Coins, Loader2, Bot } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PageContainer from "@/components/page-container";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";

export default function EthyTokenDashboard() {


  const { data, isLoading, error } = useQuery({
    queryKey: ['ethy-token-metrics'],
    queryFn: () => fetch('https://api.geckoterminal.com/api/v2/networks/base/tokens/0xC44141a684f6AA4E36cD9264ab55550B03C88643').then(res => res.json())
  })

  const { data: metricsData, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['public-metrics'],
    queryFn: () => fetch('/api/public/metrics').then(res => res.json())
  })

  if (isLoading || metricsLoading) return <Loader2 className="w-4 h-4 animate-spin" />
  if (error || metricsError) return <div>Error</div>

  return (
    <PageContainer title="Metrics" description="View the latest metrics for the ETHY token">


      <Section title="Market Metrics" color="bg-green-50 dark:bg-green-950">
        <MetricCard
          title="Current Price"
          value={`$${data && Number(data.data.attributes.price_usd).toLocaleString(undefined, { minimumFractionDigits: 5, maximumFractionDigits: 5 })}`}
          subValue="per ETHY token"
          icon={<DollarSign className="h-6 w-6" />}
          className=""
        />
        <MetricCard
          title="Market Capitalization"
          value={`$${data && Number(data.data.attributes.fdv_usd).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subValue="of Fully Diluted Market Cap"
          icon={<PieChart className="h-6 w-6" />}
          className=""
        />
        <MetricCard
          title="Trading Volume"
          value={`$${data && Number(data.data.attributes.volume_usd.h24).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue="in last 24 hours"
          icon={<BarChart3 className="h-6 w-6" />}
          className=""
        />
      </Section>

      <Section title="Agent Stats" color="bg-blue-50 dark:bg-blue-950">
        <MetricCard
          title="Agent Deployed"
          value={metricsData?.totalAgents?.toLocaleString() || "-"}
          subValue="agents created"
          icon={<Bot className="h-6 w-6" />}
          className=""
        />
        <MetricCard
          title="Smart Automations"
          value={metricsData?.totalExecutions?.toLocaleString() || "-"}
          subValue="automations created"
          icon={<Clock className="h-6 w-6" />}
          className=""
        />
        <MetricCard
          title="Tokens Burned"
          value={`${metricsData?.ethyCreditsUsed || "-"} $ETHY`}
          subValue="used as credits"
          icon={<Calendar className="h-6 w-6" />}
          className=""
        />
      </Section>
      

      <Section title="Supply & Holders" color="bg-yellow-50 dark:bg-yellow-950">        
        <MetricCard
          className = "hidden"
          title="Staked ETHY"
          value=""
          subValue="with value"
          icon={<Coins className="h-6 w-6" />}
        />
        <MetricCard
          title="Number of Holders"
          value="1,978"
          subValue="holders"
          icon={<Users className="h-6 w-6" />}
          className=""
        />
        <MetricCard
          title="Circulating vs Total Supply"
          value="615,110,000 ETHY"
          subValue="out of 1,000,000,000 ETHY"
          icon={<Package className="h-6 w-6" />}
          className=""
        />
      </Section>
    </PageContainer>
  )
}

interface SectionProps {
  title: string;
  color: string;
  children: ReactNode;
}

function Section({ title, color, children }: SectionProps) {
  return (
    <div className={`p-0`}>
      <h2 className="text-xl mb-4 text-secondary flex items-center gap-2 mt-12">
      {title}
      </h2>
      <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 gap-6">{children}</div>
    </div>
  )
}

interface MetricCardProps {
  title: string;
  value: string;
  subValue: string;
  icon: ReactNode;
  className?: string;
}

function MetricCard({ title, value, subValue, icon, className = "" }: MetricCardProps) {
  return (
    <Card className={`card-outline ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-light">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-violeta">{value}</div>
        <p className="text-xs text-muted-foreground">{subValue}</p>
      </CardContent>
    </Card>
  )
}

