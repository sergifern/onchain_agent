'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react";



export default function TwitterConnectionCard() {
  const [twitterConnected, setTwitterConnected] = useState(false);

  const handleTwitterConnect = () => {
    setTwitterConnected(!twitterConnected)
  }

  return (
    <Card className="mb-12 border-none bg-secondary/20">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {/* X logo circle */}
          <div className="mr-4 bg-black rounded-full p-2 w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-md">X Integration</h2>
            <p className="text-sm text-muted-foreground">
              {twitterConnected
                ? "Your Agent can now post updates to Twitter."
                : "Connect your profile to buy, sell, transfer, or create tasks on X by simply interacting with @ethy_agent."}
            </p>
          </div>
        </div>
        <Button
          variant={twitterConnected ? "outline" : "default"}
          onClick={handleTwitterConnect}
          className="flex items-center"
          disabled={true}
        >
          {twitterConnected ? "Disconnect Twitter" : "Coming soon"}
        </Button>
      </CardContent>
    </Card>
  )
} 