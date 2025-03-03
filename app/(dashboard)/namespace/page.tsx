"use client"

import { usePrivy, useWallets } from "@privy-io/react-auth"
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
import { ArrowUpRight, PlusCircle, File } from "lucide-react";
import { useEffect } from "react";
import { useSetActiveWallet } from "@privy-io/wagmi";
import NameSpacesCard from "@/components/namespaces";
import { NamespaceDocs } from "@/components/namespaces/namespace-docs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">

          <NameSpacesCard />

          <Card className="md:w-full bg-gradient-to-tr from-[#471877] via-[#6638ff] to-transparent">
            <CardHeader>
              <CardTitle className="text-md font-semibold">How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-white/75">
              Claiming a Namespace gives users full control over their data, tied to their Digital Identity and usable anywhere. This structured data is AI-ready, enabling seamless interaction with AI Agents and unlocking the full potential of the Agentic Economy.
              </p>

              <Link href="/dashboard/namespace/create" className="pt-4 text-sm flex flex-row items-center gap-2 group/item">
                Read more
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/item:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <EmptyDocumentTable />
        {/* <NamespaceDocs documents={documents} /> */}
      </div>
    </PageContainer>
  )
}


function EmptyDocumentTable() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage Namespace documents. Ready for AI Agents.</p>
        </div>
        <Button disabled className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Document
        </Button>
      </div>

      <div className="max-w-sm mx-auto gap-4 pt-16 text-center">
        <div className="text-sm text-secondary max-w-sm text-center">
          You haven&apos;t added any documents yet. We are rolling out this feature for users with Claimed Namespace.
        </div>
      </div>
    </div>
  )
}
