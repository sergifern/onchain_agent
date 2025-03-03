"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight, Github, Twitter, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { MenuBar } from "@/components/menu-bar"
import { useQuery } from "@tanstack/react-query"
import { Avatar, Identity, Name, Address, IdentityCard, Socials } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { useRouter } from "next/navigation";

export default function NamespacesPage() {
  const [search, setSearch] = useState("")
  const router = useRouter();

  
  const { data, isLoading, error } = useQuery({
    queryKey: ['namespaces'],
    queryFn: () => fetch('/api/namespace').then(res => res.json())
  })

  if (isLoading) return <Loader2 className="w-4 h-4 animate-spin" />
  if (error) return <div>Error</div>
  console.log(data)


  const filteredNamespaces = Array.isArray(data.namespaces)
    ? data.namespaces.filter((ns: any) => ns.name.toLowerCase().includes(search.toLowerCase()))
    : [];


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-3xl mb-12 font-hansengrotesk text-center">Namespace Explorer</h1>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search namespaces..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>


      <div className="grid grid-cols-1 md:!grid-cols-2 gap-6">
        {filteredNamespaces.map((ns: any) => (
          <div onClick={() => router.push(`/namespace/explore/${ns.name}`)} key={ns.id}>
            <Card className="namespace-card p-6 space-y-4 cursor-pointer bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-[#08090b] via-violeta to-bg-sidebar/20">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                <Avatar address={ns.address} chain={base} /> 
                <div className="flex flex-col gap-0">
                  <Name address={ns.address} chain={base} />
                  <Address address={ns.address} />
                </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={ns.claimed ? "default" : "secondary"}>{ns.claimed ? "Claimed" : "Available"}</Badge>
                <span className="text-sm text-zinc-400">{ns.documents} documents</span>
              </div>

              <div className="flex items-center gap-4 text-zinc-400">
                <Socials
                  address="0x4bEf0221d6F7Dd0C969fe46a4e9b339a84F52FDF"
                  chain={base}
                /> 
              </div>

              {ns.isOwner && (
                <div className="top-3 right-3">
                  <Badge variant="outline" className="border-violet-400 text-violet-400">
                    Your Namespace
                  </Badge>
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

