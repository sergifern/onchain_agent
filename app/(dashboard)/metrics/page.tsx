import { Flame, DollarSign, PieChart, Users, BarChart3, Clock, Package, Calendar, Coins } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PageContainer from "@/components/page-container";

export default function EthyTokenDashboard() {
  return (
    <PageContainer title="Burn & Supply" description="View the latest metrics for the ETHY token">

      <Section title="Burn Stats" color="bg-blue-50 dark:bg-blue-950">
        <MetricCard
          title="Burned Tokens"
          value="10,000,000 ETHY"
          subValue="1% of initial supply"
          icon={<Flame className="h-6 w-6" />}
        />
        <MetricCard
          title="Last Token Burn"
          value="10,000,000 ETHY"
          subValue="burned on Feb 2025"
          icon={<Clock className="h-6 w-6" />}
        />
        <MetricCard
          title="Next Token Burn"
          value="-"
          subValue="scheduled burn of 0 ETHY"
          icon={<Calendar className="h-6 w-6" />}
        />
      </Section>

      <Section title="Market Metrics" color="bg-green-50 dark:bg-green-950">
        <MetricCard
          title="Current ETHY Price"
          value="$0.002"
          subValue="0.0012 ETH per token"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <MetricCard
          title="Market Capitalization"
          value="$2,110,000"
          subValue="Market Cap"
          icon={<PieChart className="h-6 w-6" />}
        />
        <MetricCard
          title="24h Trading Volume"
          value="$60,000"
          subValue="20 ETH in 24h volume"
          icon={<BarChart3 className="h-6 w-6" />}
        />
      </Section>

      

      <Section title="Supply & Holders" color="bg-yellow-50 dark:bg-yellow-950">        
        <MetricCard
          title="Staked ETHY"
          value="50,000,000 ETHY"
          subValue="with value of $100,000"
          icon={<Coins className="h-6 w-6" />}
        />
        <MetricCard
          title="Number of Holders"
          value="10,020"
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

function MetricCard({ title, value, subValue, icon }) {
  return (
    <Card className="card-outline">
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

