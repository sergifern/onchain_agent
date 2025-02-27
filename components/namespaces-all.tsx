import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, SquareArrowOutUpRight } from "lucide-react"
import { usePrivy, useSendTransaction } from "@privy-io/react-auth";
import { useName } from "@coinbase/onchainkit/identity"
import { base } from "viem/chains"
import NamespaceClaim from "./namespace-claim"

interface StatProps {
  value: number
  label: string
}

interface SectionProps {
  title: string 
  domain: string
  connected: boolean
  available: boolean
  username?: string
  stats: StatProps[]
}

const Stat = ({ value, label }: StatProps) => (
  <div className="text-center">
    <p className="text-lg font-bold text-muted-foreground">{value}</p>
    <p className="text-xs text-secondary">{label}</p>
  </div>
)

const Section = ({ title, domain, connected, available, username, stats }: SectionProps) => (
  <div className="flex flex-col items-center space-y-4 w-full">
    <div className="flex w-full items-center justify-between">
      <div className="flex gap-1 items-center">
        <h3 className="text-lg font-light">{title}</h3>
      <p className="text-sm text-muted-foreground">{domain}</p>
      </div>
      <SquareArrowOutUpRight className="w-3 h-3 text-muted-foreground" />

    </div>
    <div className="w-full grid-cols-3 gap-4">
      {connected ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm">{username}</span>
          <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
        </div>
      ) : (
        available ? (
          <NamespaceClaim />
        ) : (
          <p className="text-sm text-muted-foreground">Not available yet</p>
        )
      )}
    </div>

    <div className="hidden grid w-full grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Stat key={index} {...stat} />
      ))}
    </div>
  </div>
)


export default function StatsCard() {

  return (
    <Card className="w-full max-w-3xl card-outline">
      <CardHeader>
        <CardTitle className="text-md font-semibold">My Domains</CardTitle>
        <p className="text-sm text-muted-foreground">Overview of your domain names across different naming services</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
          <div className="flex items-stretch justify-center px-4">
            <Section
              title="Basenames"
              domain=".base.eth"
              connected={false}
              available={true}
              stats={[
                { value: 12, label: "Documents" },
                { value: 3, label: "Active" },
                { value: 9, label: "Inactive" },
              ]}
            />
          </div>
          <div className="flex items-stretch justify-center px-4 relative">
            <Separator orientation="vertical" className="bg-muted-foreground/40 absolute left-0 h-full hidden md:block" />
            <Section
              title="SNS"
              domain=".sol"
              connected={false}
              available={false}
              username="alice.sol"
              stats={[
                { value: 5, label: "Domains" },
                { value: 2, label: "Subdomains" },
                { value: 7, label: "Total" },
              ]}
            />
            <Separator orientation="vertical" className="bg-muted-foreground/40 absolute right-0 h-full hidden md:block" />
          </div>
          <div className="flex items-stretch justify-center px-4">
            <Section
              title="ENS"
              domain=".eth"
              connected={false}
              available={false}
              stats={[
                { value: 0, label: "Primary" },
                { value: 0, label: "Secondary" },
                { value: 0, label: "Total" },
              ]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

