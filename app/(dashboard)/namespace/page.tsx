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
import Namespaces from "@/components/namespaces";

export default function Settings() {
  const { logout, user, ready, authenticated } = usePrivy()
  const { sendTransaction } = useSendTransaction();
  console.log(user);

  const address2 = '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1';

  const mainAccount = user?.linkedAccounts.find(
    (acc) => (acc.type === "wallet" && acc.connectorType !== "embedded")
  )
  
  const address = mainAccount?.address;
  const { data: name, isLoading: nameIsLoading } = useName({ address: address, chain: base });

  return (
    <PageContainer title="Namespace" description="Manage your namespace">
      <div className="flex flex-row gap-6 mb-12">
        <Namespaces />
        <Card className="w-1/2 bg-gradient-to-tr from-[#471877] via-[#6638ff] to-transparent">
          <CardHeader>
            <CardTitle className="text-md font-semibold">How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              The deeper the liquidity (TVL), the lower the slippage a pool will offer. LPs get AERO emissions, while veAERO lockers get the pool trading fees as an incentive to vote on the most productive pools.
            </p>

            <Link href="/dashboard/namespace/create" className="pt-4 text-sm flex flex-row items-center gap-2 group/item">
              Read more
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/item:translate-x-1" />
            </Link>
          </CardContent>
        </Card>
      </div>
      <NamespaceTable />
    </PageContainer>
  )
}

function ClaimNamespace({name}: {name: string}) {
  const { sendTransaction } = useSendTransaction();
  const { setActiveWallet } = useSetActiveWallet()

  const address = '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1';
  const {wallets} = useWallets();
  const wallet = wallets[0];
  //console.log(wallets);
  //setActiveWallet(wallet);
  return (
    <div>
      <p>Namespace: {name}</p>
      <h1>Claim Namespace</h1>
      <Button onClick={() => sendTransaction({
        to: address,
        value: parseEther("0.01"),
      })}>Mint Namespace</Button>
    </div>
  )
}

function BuyNamespace() {
  return (
    <div>
      <h1>Buy Namespace</h1>
    </div>
  )
}