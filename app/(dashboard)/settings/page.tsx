"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Settings() {
  const { logout } = usePrivy()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={logout} variant="destructive">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

