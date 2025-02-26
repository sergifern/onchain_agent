"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Twitter, Lock, Eye, Heart, Shield, ExternalLink, ChevronRight, Search, Globe, Pin, Calendar, SortDesc, SortAsc } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
// Mock data - replace with real data
const namespaceData = {
  name: "jesse.base.eth",
  avatar: "/placeholder.svg?height=100&width=100",
  address: "0x1234...5678",
  isOwner: true,
  github: "jessedoe",
  twitter: "@jessecrypto",
  lastActivity: "2024-02-20T10:30:00Z",
}
  
  
 const documents = [
    {
      id: 1,
      name: "Alpha Call: Layer 2 Season",
      type: "alpha-call",
      isPinned: true,
      isPublic: true,
      views: 1234,
      likes: 89,
      txHash: "0x1234567890abcdef",
      lastUpdated: "2024-02-20T10:30:00Z",
    },
    {
      id: 2,
      name: "Pizza Margherita",
      type: "note",
      isPublic: false,
      hasAccess: true,
      views: 15,
      likes: 5,
      txHash: "0x1234567890abcdef",
      lastUpdated: "2024-02-19T15:45:00Z",
    },
    {
      id: 3,
      name: "DoorDash Delivery Address",
      type: "note",
      isPublic: false,
      hasAccess: false,
      txHash: "0x1234567890abcdef",
      lastUpdated: "2024-02-18T08:20:00Z",
    },
  ]

const documentTypes = [
  { value: "all", label: "All Types" },
  { value: "alpha-call", label: "Alpha Calls" },
  { value: "note", label: "Notes" },
  { value: "product", label: "Store Products" },
  { value: "portfolio", label: "Portfolio" },
]   


export default function NamespacePage() {
  const [isSecured, setIsSecured] = useState(false)
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [sortBy, setSortBy] = useState("updated")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const observerTarget = useRef(null)

  // Simulated infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true)
          // Simulate loading more data
          setTimeout(() => {
            setPage((p) => p + 1)
            setLoading(false)
          }, 1000)
        }
      },
      { threshold: 1.0 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [loading])

  const filteredDocuments = documents
    .filter((doc) => {
      if (type !== "all" && doc.type !== type) return false
      if (search && !doc.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      const order = sortOrder === "desc" ? -1 : 1
      switch (sortBy) {
        case "updated":
          return (new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()) * order
        case "views":
          return (a.views - b.views) * order
        case "likes":
          return (a.likes - b.likes) * order
        default:
          return 0
      }
    })

    const getStatusBadge = (doc: (typeof documents)[0]) => {
      if (doc.isPublic) {
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <Globe className="w-3 h-3 mr-1" />
            Public
          </Badge>
        )
      }
      if (doc.hasAccess) {
        return (
          <Badge variant="outline" className="border-violet-400 text-violet-400">
            <Lock className="w-3 h-3 mr-1" />
            Private (Access Granted)
          </Badge>
        )
      }
      return (
        <Badge variant="outline" className="border-red-400 text-red-400">
          <Lock className="w-3 h-3 mr-1" />
          Private
        </Badge>
      )
    } 

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <Image
              src={namespaceData.avatar || "/placeholder.svg"}
              alt={namespaceData.name}
              className="w-20 h-20 rounded-full bg-zinc-700"
              width={80}
              height={80}
            />
            <div className="space-y-2">
              <div>
                <h1 className="text-2xl font-bold">{namespaceData.name}</h1>
                <p className="text-zinc-400">{namespaceData.address}</p>
              </div>
              <div className="flex items-center gap-4 text-zinc-400">
                <a
                  href={`https://github.com/${namespaceData.github}`}
                  className="hover:text-violeta transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={`https://twitter.com/${namespaceData.twitter}`}
                  className="hover:text-violeta transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          {namespaceData.isOwner && (
            <Button
              variant="outline"
              className="border-violeta text-violeta hover:bg-violet-400/10"
              onClick={() => setIsSecured(!isSecured)}
            >
              <Shield className="w-4 h-4 mr-2" />
              {isSecured ? "Secured" : "Add Document"}
            </Button>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-700">
          <p className="text-sm text-zinc-400">
            Last activity: {new Date(namespaceData.lastActivity).toLocaleDateString()}
          </p>
        </div>
      </Card>

      <div className="space-y-6">
      {/* Filters */}   
        <div className="sticky top-0 z-10 -mx-6 px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-4">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Last Updated</SelectItem>
                  <SelectItem value="views">Views</SelectItem>
                  <SelectItem value="likes">Likes</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="flex flex-col gap-6">
          {filteredDocuments.map((doc) => (
            <Link href={`/namespace/basename/${doc.id}`} key={doc.id}>
              <TooltipProvider>
                <Card
                  className={`group hover:bg-zinc-800/50 transition-colors ${
                    doc.isPinned ? "bg-violeta" : "bg-sidebar"
                  }`}
                >
                  <div className="p-4 grid grid-cols-[auto,1fr,auto] gap-4 items-center">
                    {/* Pin Status */}
                    {doc.isPinned && (
                      <div className="text-violet-400">
                        <Pin className="w-4 h-4" />
                      </div>
                    )}

                    {/* Document Info */}
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold truncate">{doc.name}</h3>
                        <Tooltip>
                          <TooltipTrigger>{getStatusBadge(doc)}</TooltipTrigger>
                          <TooltipContent>
                            {doc.isPublic
                              ? "This document is public and available to everyone"
                              : doc.hasAccess
                                ? "Private (You have access to this document)"
                                : "This document is private. You need owner access to view it"}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Last updated: {doc.lastUpdated}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {doc.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {doc.likes}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Shield className="w-4 h-4 text-violet-400" />
                        <span className="font-mono">{doc.txHash}</span>
                        <Link
                          href={`https://basescan.org/tx/${doc.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-400 hover:text-violet-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-violet-400" />
                    </div>
                  </div>
                </Card>
              </TooltipProvider>
            </Link>
          ))}

        </div>
      </div>
    
      {/* Documents List */}
      <div className="hidden grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => (
          <Link href={`/namespace/${namespaceData.name}/${doc.id}`} key={doc.id}>
            <Card
              className={`namespace-card p-6 space-y-4 cursor-pointer group bg-zinc-800/50
                ${!doc.isPublic && !doc.hasAccess ? "blur-sm hover:blur-sm" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{doc.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={doc.isPublic ? "default" : "secondary"} className="flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {doc.isPublic ? "Public" : doc.hasAccess ? "Private (Access Granted)" : "Private"}
                    </Badge>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-violet-400" />
              </div>

              {(doc.isPublic || doc.hasAccess) && (
                <div className="flex items-center gap-4 text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {doc.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {doc.likes}
                  </span>
                </div>
              )}

              {!doc.isPublic && !doc.hasAccess && <div className="text-sm text-zinc-400">This document is private</div>}

              <div className="text-xs text-zinc-500">
                Last updated: {new Date(doc.lastUpdated).toLocaleDateString()}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

