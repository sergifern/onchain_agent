"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Package, Notebook, BarChart3, PenLine, ChevronRight } from "lucide-react"
import Link from "next/link"

// Mock wallet connection status - replace with real wallet connection
const isWalletConnected = true
const currentNamespace = "jesse.base.eth"

const templates = [
  {
    id: "alpha-call",
    name: "Alpha Call",
    icon: FileText,
    description: "Structured analysis with entry points, targets, and conviction levels",
    preview: {
      title: "Sample Alpha Call",
      conviction: "High",
      timeframe: "Mid-term",
      entry: "$100",
      target: "$150",
      stopLoss: "$85",
    },
  },
  {
    id: "product",
    name: "Product",
    icon: Package,
    description: "Detailed product information with specifications and reviews",
    preview: {
      name: "Sample Product",
      category: "DeFi",
      rating: "4.5/5",
      status: "Live",
    },
  },
  {
    id: "note",
    name: "Note",
    icon: Notebook,
    description: "Free-form notes and thoughts",
    preview: {
      title: "Sample Note",
      date: "2024-02-25",
      tags: ["Research", "DeFi"],
    },
  },
  {
    id: "portfolio",
    name: "Portfolio",
    icon: BarChart3,
    description: "Track and share your portfolio performance",
    preview: {
      assets: "15",
      performance: "+25%",
      timeframe: "30d",
    },
  },
]

export default function AddDocumentPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  if (!isWalletConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Card className="p-6 bg-zinc-800/50 text-center space-y-4 max-w-md w-full">
          <h2 className="text-xl font-semibold">Connect Wallet</h2>
          <p className="text-zinc-400">Please connect your wallet to create a new document in your namespace</p>
          <Button className="w-full">Connect Wallet</Button>
        </Card>
      </div>
    )
  }

  const renderPreview = (template: (typeof templates)[0]) => {
    switch (template.id) {
      case "alpha-call":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-violet-400 border-violet-400">
                Alpha Call
              </Badge>
              <h3 className="text-lg font-semibold">{template.preview.title}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-zinc-400">Entry</div>
                <div className="font-mono">{template.preview.entry}</div>
              </div>
              <div>
                <div className="text-zinc-400">Target</div>
                <div className="font-mono text-green-400">{template.preview.target}</div>
              </div>
              <div>
                <div className="text-zinc-400">Stop Loss</div>
                <div className="font-mono text-red-400">{template.preview.stopLoss}</div>
              </div>
            </div>
          </div>
        )
      case "product":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-violet-400 border-violet-400">
                Product
              </Badge>
              <h3 className="text-lg font-semibold">{template.preview.name}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-zinc-400">Category</div>
                <div>{template.preview.category}</div>
              </div>
              <div>
                <div className="text-zinc-400">Rating</div>
                <div>{template.preview.rating}</div>
              </div>
            </div>
          </div>
        )
      case "note":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-violet-400 border-violet-400">
                Note
              </Badge>
              <h3 className="text-lg font-semibold">{template.preview.title}</h3>
            </div>
            <div className="flex gap-2">
              {template.preview.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )
      case "portfolio":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-violet-400 border-violet-400">
                Portfolio
              </Badge>
              <h3 className="text-lg font-semibold">Portfolio Tracker</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-zinc-400">Assets</div>
                <div>{template.preview.assets}</div>
              </div>
              <div>
                <div className="text-zinc-400">Performance</div>
                <div className="text-green-400">{template.preview.performance}</div>
              </div>
              <div>
                <div className="text-zinc-400">Period</div>
                <div>{template.preview.timeframe}</div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create New Document</h1>
        <p className="text-zinc-400">
          Adding to namespace: <span className="text-violet-400">{currentNamespace}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:!grid-cols-2 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="relative group">
            <Link href={`/namespace/add/${template.id}`}>
              <Card className="p-6 bg-zinc-800/50 space-y-4 cursor-pointer group namespace-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                      <template.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-zinc-400">{template.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-violet-400" />
                </div>

                <div className="border-t border-zinc-700/50 pt-4">{renderPreview(template)}</div>
              </Card>
            </Link>
          </div>
        ))}

        <Link href="/namespace/add/manual">
          <Card className="p-6 bg-zinc-800/50 space-y-4 cursor-pointer group namespace-card h-full">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                  <PenLine className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Manual Entry</h3>
                  <p className="text-sm text-zinc-400">Create a custom document without a template</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-violet-400" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}

