import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface TierProps {
  name: string
  requests: number
  price: number
}

const Tier = ({ name, requests, price }: TierProps) => (
  <div className="text-center">
    <span className="font-medium block">{name}</span>
    <span className="block text-sm">{requests.toLocaleString()} requests</span>
    <span className="text-sm text-muted-foreground">{price} ETHY/month</span>
  </div>
)

export default function ApiPricingCard() {
  return (
    <Card className="bg-transparent border-none max-w-lg">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center font-light">
          Pricing
          <Badge variant="secondary" className="text-sm">
            Pay with ETHY
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:!flex-row justify-between items-center gap-6">
          <div className="text-left">
            <span className="text-3xl font-bold">1,000 ETHY</span>
            <span className="block text-sm text-muted-foreground">per API request</span>
          </div>

          <Separator orientation="vertical" className="hidden md:!block h-20 bg-secondary/50" />

          <div className="text-left">
            <h3 className="font-semibold mb-2">Free Request Limits</h3>
            <ul className="list-none text-sm space-y-1">
              <li>100 requests/day</li>
              <li>1,000 requests/month</li>
            </ul>
          </div>


        </div>
      </CardContent>
    </Card>
  )
}

