"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import type React from "react" // Added import for React
import { base } from 'viem/chains';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from "../wagmiConfig";


const queryClient = new QueryClient();


export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        defaultChain: base ,
        appearance: {
          theme: 'dark',
        },
        embeddedWallets: {
          ethereum: { 
            createOnLogin: "all-users",
          },
          solana: {
            createOnLogin: "all-users",
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
            {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}

