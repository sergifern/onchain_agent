"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Wallet() {
  const { user, sendTransaction } = usePrivy()

  const handleSendTransaction = async () => {
    if (user?.wallet) {
      try {
        await sendTransaction({
          to: "0x0000000000000000000000000000000000000000",
          value: "0",
        })
        alert("Transaction sent successfully!")
      } catch (error) {
        console.error("Error sending transaction:", error)
        alert("Failed to send transaction")
      }
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Wallet</h1>
      <Card>
        <CardHeader>
          <CardTitle>Wallet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Address: {user?.wallet?.address || "Not connected"}</p>
          <Button onClick={handleSendTransaction} className="mt-4">
            Send Test Transaction
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

