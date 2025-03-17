"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Edit2, Lock, Unlock, Plus, ExternalLink, ChevronRight, Search, Calendar, Heart, Pin, SortAsc, SortDesc, Globe, Badge, Shield } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "../ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { DocumentData } from "@/lib/interface"


export function NamespaceDocs({documents}: {documents: DocumentData[]}) {
  const [isSecured, setIsSecured] = useState(false)
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [sortBy, setSortBy] = useState("updated")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const router = useRouter();
  
  const filteredDocuments = documents && documents
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
            <Globe className="w-5 h-5 text-secondary"  />
        )
      }
      if (doc.access.length > 0) {
        return (
          <Badge className="border-violeta text-violeta">
            <Lock className="w-3 h-3  " />
            Private (Access Granted)
          </Badge>
        )
      }
      return (
        <Badge className="border-red-400 text-red-400">
          <Lock className="w-3 h-3" />
          Private
        </Badge>
      )
    } 

  return (
  <div className="space-y-6">
    {/* Filters */}   
    <div className="sticky top-0 z-10 -mx-6 px-6 py-4">
      <div className="flex flex-col md:!flex-row gap-4">
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
      {documents && filteredDocuments.map((doc) => (
        <div onClick={() => router.push(`/namespace/explore/${doc.namespace}/${doc.id}`)} key={doc.id}>
          <TooltipProvider>
            <Card
              className={`group hover:bg-violet-900/40 transition-colors cursor-pointer  border-violeta/60 bg-transparent border border-solid`}
            >
              <div className="p-4 flex justify-between items-center">

                {/* Document Info */}
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold truncate">{doc.name}</h3>
                    {getStatusBadge(doc)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-violeta" />
                      {doc.lastUpdated}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-violeta" />
                      <span className="font-mono">{doc.blockchain.txHash}</span>
                      <Link
                        href={`https://basescan.org/tx/${doc.blockchain.txHash}`}
                        target="_blank"
                        className="text-violet-400 hover:text-violeta/20"
                      >
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {doc.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {doc.likes}
                  </span>
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-violeta" />
                </div>
              </div>
            </Card>
          </TooltipProvider>
        </div>
      ))}

    </div>
  </div>
  )
}
 
