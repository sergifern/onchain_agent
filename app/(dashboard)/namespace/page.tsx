"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight, Github, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { MenuBar } from "@/components/menu-bar"
export default function NamespacesPage() {
  const [search, setSearch] = useState("")

  // Mock data - replace with real data
  const namespaces = [
    {
      name: "jesse.base.eth",
      avatar: "/placeholder.svg?height=100&width=100",
      address: "0x1234...5678",
      documents: 12,
      claimed: true,
      isOwner: true,
      github: "jessedoe",
      twitter: "@jessecrypto",
    },
    {
      name: "alpha.base.eth",
      avatar: "/placeholder.svg?height=100&width=100",
      address: "0x9876...4321",
      documents: 5,
      claimed: true,
      isOwner: false,
      github: "alphatrader",
      twitter: "@alphacalls",
    },
    {
      name: "degen.base.eth",
      avatar: "/placeholder.svg?height=100&width=100",
      address: "0x4567...8901",
      documents: 8,
      claimed: false,
      isOwner: false,
      github: "degenlabs",
      twitter: "@degenlabs",
    },
  ]

  const filteredNamespaces = namespaces.filter((ns) => ns.name.toLowerCase().includes(search.toLowerCase()))

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

      <MenuBar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNamespaces.map((ns) => (
          <Link href={`/namespace/${ns.name}`} key={ns.name}>
            <Card className="namespace-card p-6 space-y-4 cursor-pointer group bg-gradient-to-tr from-[#471877]/20 via-[#6638ff]/40 to-transparent">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={ns.avatar || "/placeholder.svg"}
                    alt={ns.name}
                    className="w-12 h-12 rounded-full bg-zinc-700"
                    width={48}
                    height={48}
                  />
                  <div>
                    <h3 className="font-semibold">{ns.name}</h3>
                    <p className="text-sm text-zinc-400">{ns.address}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-violet-400" />
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={ns.claimed ? "default" : "secondary"}>{ns.claimed ? "Claimed" : "Available"}</Badge>
                <span className="text-sm text-zinc-400">{ns.documents} documents</span>
              </div>

              <div className="flex items-center gap-4 text-zinc-400">
                <a href={`https://github.com/${ns.github}`} className="hover:text-violet-400 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
                <a href={`https://twitter.com/${ns.twitter}`} className="hover:text-violet-400 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>

              {ns.isOwner && (
                <div className="top-3 right-3">
                  <Badge variant="outline" className="border-violet-400 text-violet-400">
                    Your Namespace
                  </Badge>
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

