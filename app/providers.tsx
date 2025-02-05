"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import type React from "react" // Added import for React
import { base } from 'viem/chains';


export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        defaultChain: base 
      }}
    >
      {children}
    </PrivyProvider>
  )
}

