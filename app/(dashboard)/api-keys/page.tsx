import PageContainer from "@/components/page-container"
import { usePrivy } from "@privy-io/react-auth"
import Link from "next/link"
import { Car, MoveUpRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import ApiPricingCard from "@/components/api-pricing"
import { Button } from "@/components/ui/button"
export default function Settings() {

  return (
    <PageContainer title="API Keys" description="Manage your API Keys to interact with the Ethy AI API">
      <ApiPricingCard />
      <Card className="mt-4 card-outline">
        <CardHeader>
          <CardTitle>Get early access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm">
            Manage your API Keys to integrate with the Ethy AI
          </p>

          <Link target="_blank" href="https://forms.gle/HXJBwLGgekdseVAPA">
            <Button size="sm" variant="outline">
              <div className="flex flex-row items-center gap-1">
                Request API Key
                <MoveUpRight className="w-4 h-4" />
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
