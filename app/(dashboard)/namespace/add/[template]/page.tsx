"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface FormData {
  name: string
  [key: string]: any
}

export default function AddDocumentTemplatePage({ params }: { params: { template: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({ name: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically save the document and redirect
    router.push("/namespace/jesse.base.eth")
  }

  const renderFormFields = () => {
    switch (params.template) {
      case "alpha-call":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                placeholder="Brief summary of your alpha call..."
                value={formData.summary || ""}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="h-20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="conviction">Conviction</Label>
                <Select
                  value={formData.conviction || ""}
                  onValueChange={(value) => setFormData({ ...formData, conviction: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select conviction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select
                  value={formData.timeframe || ""}
                  onValueChange={(value) => setFormData({ ...formData, timeframe: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short-term (&lt; 1 month)</SelectItem>
                    <SelectItem value="mid">Mid-term (1-3 months)</SelectItem>
                    <SelectItem value="long">Long-term (&gt; 3 months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entry">Entry Zone</Label>
                <Input
                  id="entry"
                  placeholder="$0.00"
                  value={formData.entry || ""}
                  onChange={(e) => setFormData({ ...formData, entry: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target</Label>
                <Input
                  id="target"
                  placeholder="$0.00"
                  value={formData.target || ""}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss</Label>
                <Input
                  id="stopLoss"
                  placeholder="$0.00"
                  value={formData.stopLoss || ""}
                  onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="analysis">Analysis</Label>
              <Textarea
                id="analysis"
                placeholder="Detailed analysis..."
                value={formData.analysis || ""}
                onChange={(e) => setFormData({ ...formData, analysis: e.target.value })}
                className="h-32"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="catalysts">Catalysts</Label>
                <Textarea
                  id="catalysts"
                  placeholder="One catalyst per line..."
                  value={formData.catalysts || ""}
                  onChange={(e) => setFormData({ ...formData, catalysts: e.target.value })}
                  className="h-24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="risks">Risks</Label>
                <Textarea
                  id="risks"
                  placeholder="One risk per line..."
                  value={formData.risks || ""}
                  onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
                  className="h-24"
                />
              </div>
            </div>
          </>
        )

      case "product":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defi">DeFi</SelectItem>
                    <SelectItem value="nft">NFT</SelectItem>
                    <SelectItem value="dao">DAO</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || ""}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="beta">Beta</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Product description..."
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="h-32"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Key Features</Label>
              <Textarea
                id="features"
                placeholder="One feature per line..."
                value={formData.features || ""}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="h-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://"
                  value={formData.website || ""}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  placeholder="@handle"
                  value={formData.twitter || ""}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                />
              </div>
            </div>
          </>
        )

      case "portfolio":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Portfolio Type</Label>
                <Select
                  value={formData.type || ""}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="dao">DAO Treasury</SelectItem>
                    <SelectItem value="fund">Investment Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select
                  value={formData.visibility || ""}
                  onValueChange={(value) => setFormData({ ...formData, visibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="members">Members Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="strategy">Investment Strategy</Label>
              <Textarea
                id="strategy"
                placeholder="Describe your investment strategy..."
                value={formData.strategy || ""}
                onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                className="h-32"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assets">Asset Allocation</Label>
              <Textarea
                id="assets"
                placeholder="List your assets and allocations..."
                value={formData.assets || ""}
                onChange={(e) => setFormData({ ...formData, assets: e.target.value })}
                className="h-32"
              />
            </div>
          </>
        )

      case "manual":
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your content here..."
              value={formData.content || ""}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="h-[400px]"
            />
          </div>
        )
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/namespace/add" className="text-zinc-400 hover:text-violet-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">
          New{" "}
          {params.template === "manual"
            ? "Document"
            : params.template
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
        </h1>
      </div>

      <Card className="p-6 bg-zinc-800/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              placeholder="Enter document name..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {renderFormFields()}

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Create Document</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

