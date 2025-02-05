"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { login, authenticated, user } = usePrivy()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Email: {`${user?.email}` || "Not provided"}</p>
          <p>Wallet Address: {user?.wallet?.address || "Not connected"}</p>

          <div>
            {authenticated ? (
              <span>Welcome, {`${user?.email}` || user?.wallet?.address}</span>
            ) : (
              <Button onClick={login}>Connect Wallet</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

