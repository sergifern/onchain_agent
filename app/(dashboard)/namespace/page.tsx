"use client"

import { usePrivy, useWallets } from "@privy-io/react-auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {useAccount} from 'wagmi';
import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { Avatar, Identity, Name, Badge, Address, IdentityCard } from '@coinbase/onchainkit/identity';
import { useName, useAvatar } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import PageContainer from "@/components/page-container";
import { NamespaceTable } from "@/components/namespace-table";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import { useSetActiveWallet } from "@privy-io/wagmi";
import NameSpacesCard from "@/components/namespaces";
import { NamespaceDocs } from "@/components/namespaces/namespace-docs";

const documents = [
  {
    id: "1",
    namespace: "basename",
    name: "Alpha Call: Layer 2 Season",
    type: "alpha-call",
    isPublic: true,
    views: 1234,
    likes: 89,
    blockchain: {
      network: "base",
      txHash: "0x1234567890abcdef",
      blockNumber: 1234567890,
      timestamp: "2024-02-20T10:30:00Z",
    },
    lastUpdated: "2024-02-20T10:30:00Z",
    description: "This is a description",
    access: [],
  },
  {
    id: "2",
    namespace: "basename",
    name: "Pizza Margherita",
    type: "note",
    isPublic: true,
    hasAccess: true,
    views: 15,
    likes: 5,
    blockchain: {
      network: "base",
      txHash: "0x1234567890abcdef",
      blockNumber: 1234567890,
      timestamp: "2024-02-19T15:45:00Z",
    },
    lastUpdated: "2024-02-19T15:45:00Z",
    description: "This is a description",
    access: [],
  },
  {
    id: "3",
    namespace: "basename",
    name: "DoorDash Delivery Address",
    type: "note",
    isPublic: true,
    views: 15,
    likes: 5,
    hasAccess: true,
    blockchain: {
      network: "base",
      txHash: "0x1234567890abcdef",
      blockNumber: 1234567890,
      timestamp: "2024-02-18T08:20:00Z",
    },
    lastUpdated: "2024-02-18T08:20:00Z",
    description: "This is a description",
    access: [],
  },
]

export default function Page() {


  return (
    <PageContainer title="Namespace" description="Manage your namespace">
      <div className="max-w-4xl mx-auto">
        <div className="flex md:flex-row flex-col gap-6 mb-12">
          <NameSpacesCard />

          <Card className="md:w-full bg-gradient-to-tr from-[#471877] via-[#6638ff] to-transparent">
            <CardHeader>
              <CardTitle className="text-md font-semibold">How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-white/75">
              Minting a namespace gives users full control over their data, tied to their Digital Identity and usable anywhere. This structured data is AI-ready, enabling seamless interaction with AI Agents and unlocking the full potential of the Agentic Economy.
              </p>

              <Link href="/dashboard/namespace/create" className="pt-4 text-sm flex flex-row items-center gap-2 group/item">
                Read more
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/item:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
        </div>
        <NamespaceDocs documents={documents} />
      </div>
    </PageContainer>
  )
}
