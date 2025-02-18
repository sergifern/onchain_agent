"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import type React from "react" // Added import for React
import { base } from 'viem/chains';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from "../wagmiConfig";
import { OnchainKitProvider } from "@coinbase/onchainkit";


const queryClient = new QueryClient();


export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        defaultChain: base ,
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
          <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={base} // add baseSepolia for testing
          >
            {children}
          </OnchainKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}

