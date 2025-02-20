"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi";
import PageContainer from "@/components/page-container";

export default function Settings() {
  const { logout, user } = usePrivy()
  const {address} = useAccount();

  return (
    <PageContainer title="Integrations" description="Manage your integrations">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
        <p>Wallet address: {address}</p>
        <p>Email: {JSON.stringify(user)}</p>
          <Button onClick={logout} variant="destructive">
            Logout
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

