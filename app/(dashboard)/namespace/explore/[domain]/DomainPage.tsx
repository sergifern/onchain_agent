"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ProfileCard } from "@/components/namespaces/profile-card"
import { useParams } from 'next/navigation'
import { useRouter } from "next/navigation";
import { NamespaceDocs } from "@/components/namespaces/namespace-docs"
import { Loader2, ArrowLeft } from "lucide-react"

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
      isPublic: true,
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
      hasAccess: true,
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
  const params = useParams<{ domain: string }>()
  const [isSecured, setIsSecured] = useState(false)
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [sortBy, setSortBy] = useState("updated")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['namespaces'],
    queryFn: () => fetch(`/api/namespace/${params.domain}`).then(res => res.json())
  })


  return (
    <>
    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
    {error && <div>Error</div>}
    {data && (
    <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" onClick={() => router.back()} />
          <h1 className="text-sm font-light text-muted-foreground">Go to Explore</h1>
        </div>

      <ProfileCard basename={params.domain} />
      <NamespaceDocs documents={data.documents} />
    </div>
    )}
    </>
  )
}

