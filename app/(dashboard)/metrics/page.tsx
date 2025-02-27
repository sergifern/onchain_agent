'use client'

import { Flame, DollarSign, PieChart, Users, BarChart3, Clock, Package, Calendar, Coins, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PageContainer from "@/components/page-container";
import { useQuery } from "@tanstack/react-query";


export default function EthyTokenDashboard() {


  const { data, isLoading, error } = useQuery({
    queryKey: ['ethy-token-metrics'],
    queryFn: () => fetch('https://api.geckoterminal.com/api/v2/networks/base/tokens/0xC44141a684f6AA4E36cD9264ab55550B03C88643').then(res => res.json())
  })

  if (isLoading) return <Loader2 className="w-4 h-4 animate-spin" />
  if (error) return <div>Error</div>
  console.log(data.data.attributes.price_usd)
  console.log(data.data.attributes.volume_usd.h24)
  console.log(data.data.attributes.fdv_usd)

  return (
    <PageContainer title="Burn & Supply" description="View the latest metrics for the ETHY token">


      <Section title="Market Metrics" color="bg-green-50 dark:bg-green-950">
        <MetricCard
          title="Current Price"
          value={`$${data && Number(data.data.attributes.price_usd)}`}
          subValue="per ETHY token"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <MetricCard
          title="Market Capitalization"
          value={`$${data && Number(data.data.attributes.fdv_usd)}`}
          subValue="of Fully Diluted Market Cap"
          icon={<PieChart className="h-6 w-6" />}
        />
        <MetricCard
          title="Trading Volume"
          value={`$${data && Number(data.data.attributes.volume_usd.h24).toFixed(2)}`}
          subValue="in last 24 hours"
          icon={<BarChart3 className="h-6 w-6" />}
        />
      </Section>

      <Section title="Burn Stats" color="bg-blue-50 dark:bg-blue-950">
        <MetricCard
          title="Burned Tokens"
          value="-"
          subValue="0% of initial supply"
          icon={<Flame className="h-6 w-6" />}
        />
        <MetricCard
          title="Last Token Burn"
          value="-"
          subValue="burned on -"
          icon={<Clock className="h-6 w-6" />}
        />
        <MetricCard
          title="Next Token Burn"
          value="-"
          subValue="scheduled burn of -"
          icon={<Calendar className="h-6 w-6" />}
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
          value="1,020"
          subValue="holders"
          icon={<Users className="h-6 w-6" />}
        />
        <MetricCard
          title="Circulating vs Total Supply"
          value="700,000,000 ETHY"
          subValue="out of 1,000,000,000 ETHY"
          icon={<Package className="h-6 w-6" />}
        />
      </Section>
    </PageContainer>
  )
}

function Section({ title, color, children }) {
  return (
    <div className={`p-0`}>
      <h2 className="text-xl mb-4 text-secondary flex items-center gap-2 mt-12">
      {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
    </div>
  )
}

function MetricCard({ title, value, subValue, icon, className }) {
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

