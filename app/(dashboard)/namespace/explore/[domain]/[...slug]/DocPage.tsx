"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, Bell, BellOff, Clock, Edit, Lock, Share2, MoreVertical, ExternalLink, CheckCircle, Copy, Shield, Twitter, Send, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { Metadata } from "next"
import { useRouter } from "next/navigation"

// Mock data - replace with real data
const alphaData = {
  id: "alpha-call-doge",
  name: "Alpha Call: DOGE Season Analysis",
  type: "Alpha Call",
  isPublic: true,
  isOwner: true,
  views: 1234,
  likes: 89,
  isLiked: false,
  isSubscribed: false,
  lastUpdated: "2024-02-20T10:30:00Z",
  blockchain: {
    network: "Base",
    txHash: "0x1234567890abcdef",
    blockNumber: 1234567890,
    timestamp: "2024-02-20T10:30:00Z",
  },
  content: {
    type: "structured",
    sections: [
      {
        title: "Market Overview",
        content: "DOGE has shown significant momentum in the past week, with increasing volume and social metrics...",
      },
      {
        title: "Technical Analysis",
        content:
          "Key resistance levels have been broken at $0.12 and $0.15. The next major resistance lies at $0.20...",
      },
      {
        title: "Catalysts",
        content: "1. Potential X integration\n2. DeFi developments\n3. Layer 2 solutions",
      },
      {
        title: "Risk Factors",
        content: "- Market volatility\n- Regulatory uncertainties\n- Dependency on key figures",
      },
    ],
  },
}

const documentData = {
  id: "pizzamargherita",
  type: "Product",
  isPublic: true,
  isOwner: false,
  views: 1234,
  likes: 89,
  isLiked: false,
  isSubscribed: false,
  lastUpdated: "2024-02-20T10:30:00Z",
  blockchain: {
    network: "Base",
    txHash: "0x1234567890abcdef",
    blockNumber: 1234567890,
    timestamp: "2024-02-20T10:30:00Z",
  },
  content: {
    type: "structured",
    sections: [
      {
        title: "Product Details",
        content: "Pizza Margherita is a delicious pizza with a thin crust and a generous amount of cheese.",
      },
      {
        title: "Ingredients",
        content: "Pizza Margherita is a delicious pizza with a thin crust and a generous amount of cheese.",
      },
      {
        title: "Coinbase Commerce",
        content: "https://commerce.coinbase.com/checkout/0x1234567890abcdef",
      },
    ],
  },
  name: "Pizza Margherita",
  description: "A delicious pizza with a thin crust and a generous amount of cheese.",
  image: "/pizza.png",
  price: 10,
  currency: "USD",
  quantity: 1,
}

export default function DocumentPage() {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(documentData.isLiked)
  const [likes, setLikes] = useState(documentData.likes)
  const [isSubscribed, setIsSubscribed] = useState(documentData.isSubscribed)
  const [copied, setCopied] = useState(false)
  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleShare = async (platform?: string) => {
    const shareUrl = window.location.href
    const shareText = `Check out "${documentData.name}" on Namespace`

    if (platform) {
      switch (platform) {
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          )
          break
        case "telegram":
          window.open(
            `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          )
          break
        case "farcaster":
          // Replace with actual Farcaster sharing implementation
          window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText + " " + shareUrl)}`)
          break
      }
      return
    }

    // Try native share first
    if (navigator.share) {
      try {
        await navigator.share({
          title: documentData.name,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center gap-2">
        <Link
          onClick={() => router.back()}
          href='#'
          className="text-zinc-400 hover:text-violet-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-zinc-400">Back to namespace</span>
      </div>
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-violet-400 border-violet-400">
                {documentData.type}
              </Badge>
              {!documentData.isPublic && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Private
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{documentData.name}</h1>
            <h1 className="text-md text-violeta">jesse.base.eth/{documentData.id}</h1>
          </div>

          <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-violet-400 text-violet-400 hover:bg-violet-400/10"
                      onClick={() => handleShare()}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share this document</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-violet-400 text-violet-400 hover:bg-violet-400/10"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {documentData.isOwner && (
                    <>
                      <DropdownMenuItem onClick={() => {}}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Lock className="w-4 h-4 mr-2" />
                        Make Private
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => handleShare("twitter")}>
                    <Twitter className="w-4 h-4 mr-2" />
                    Share on X
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("farcaster")}>
                    <Shield className="w-4 h-4 mr-2" />
                    Share on Farcaster
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("telegram")}>
                    <Send className="w-4 h-4 mr-2" />
                    Share on Telegram
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
          
          {documentData.isOwner && (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-violet-400 text-violet-400 hover:bg-violet-400/10">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-violet-400 text-violet-400 hover:bg-violet-400/10"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-400">
                    <Lock className="w-4 h-4 mr-2" />
                    Make Private
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 pb-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {documentData.views} views
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 hover:text-violeta ${isLiked ? "text-violeta" : ""}`}
            onClick={handleLike}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            {likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 hover:text-violeta ${isSubscribed ? "text-violeta" : ""}`}
            onClick={() => setIsSubscribed(!isSubscribed)}
          >
            {isSubscribed ? (
              <>
                <BellOff className="w-4 h-4" />
                Unsubscribe
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Subscribe
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Updated {new Date(documentData.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </div>



      {/* Blockchain Validation Card */}
      <Card className="p-6 card-outline">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-400" />
              <h3 className="font-semibold text-lg">Onchain Validation</h3>
            </div>
            <p className="text-sm text-zinc-400">
              This document&apos;s integrity is verified on {documentData.blockchain.network}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="border-violet-400 text-violet-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Content hash verified on-chain</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Transaction:</span>
              <span className="font-mono text-sm">{documentData.blockchain.txHash}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-violet-400"
                onClick={() => copyToClipboard(documentData.blockchain.txHash)}
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-violet-400"
                onClick={() => window.open(`https://basescan.org/tx/${documentData.blockchain.txHash}`, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-4 h-4" />
              <span>Block: {documentData.blockchain.blockNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-4 h-4" />
              <span>Verified: {new Date(documentData.blockchain.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Card>
            
      {/* Content */}
      {documentData.content.type === "structured" ? (
        <div className="grid gap-8">
          {documentData.content.sections.map((section, index) => (
            <Card key={index} className="p-6 card-outline">
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              <div className="text-zinc-300 space-y-2 whitespace-pre-line">{section.content}</div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 card-outline">
          <div className="text-zinc-300 whitespace-pre-line">{documentData.content.text}</div>
        </Card>
      )}
    </div>
  )
}

