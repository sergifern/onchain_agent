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



export default function NameSpacesCard() {

  return (
    <Card className="w-full card-outline">
      <CardHeader>
        <CardTitle className="text-md font-semibold">
          <div className="flex gap-1 items-baseline">
          <h3 className="text-lg font-semibold">Basename Available</h3>
          <p className="text-sm text-muted-foreground">.base.eth</p>
        </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-6 pt-6 flex justify-center">
          <NamespaceClaim />
        </div>
      </CardContent>
    </Card>
  )
}

