"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Twitter, Lock, Eye, Heart, Shield } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
// Mock data - replace with real data
const namespaceData = {
  name: "jesse.base.eth",
  avatar: "/placeholder.svg?height=100&width=100",
  address: "0x1234...5678",
  isOwner: true,
  github: "jessedoe",
  twitter: "@jessecrypto",
  lastActivity: "2024-02-20T10:30:00Z",
  documents: [
    {
      id: 1,
      name: "Alpha Call: Layer 2 Season",
      isPublic: true,
      views: 1234,
      likes: 89,
      lastUpdated: "2024-02-20T10:30:00Z",
    },
    {
      id: 2,
      name: "Private Research Notes",
      isPublic: false,
      hasAccess: true,
      views: 15,
      likes: 5,
      lastUpdated: "2024-02-19T15:45:00Z",
    },
    {
      id: 3,
      name: "Confidential Analysis",
      isPublic: false,
      hasAccess: false,
      lastUpdated: "2024-02-18T08:20:00Z",
    },
  ],
}

export default function NamespacePage() {
  const [isSecured, setIsSecured] = useState(false)

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Card */}
      <Card className="p-6 bg-zinc-800/50">
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

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {namespaceData.documents.map((doc) => (
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

