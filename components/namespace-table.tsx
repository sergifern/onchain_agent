"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Edit2, Lock, Unlock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NamespaceData {
  id: string
  name: string
  description: string
  type: "Public" | "Private"
  access: string[]
  hashTx: string
}

const myData: NamespaceData[] = [
  { id: "1", name: "docs", description: "Documentation files", type: "Public", access: [], hashTx: "0x123...abc" },
  {
    id: "2",
    name: "projects",
    description: "Project files",
    type: "Private",
    access: ["user1", "user2"],
    hashTx: "0x456...def",
  },
  { id: "3", name: "images", description: "Image assets", type: "Public", access: [], hashTx: "0x789...ghi" },
]

const sharedData: NamespaceData[] = [
  {
    id: "4",
    name: "team-project",
    description: "Shared team project",
    type: "Private",
    access: ["me", "team-lead"],
    hashTx: "0xabc...123",
  },
  {
    id: "5",
    name: "public-resources",
    description: "Public resources",
    type: "Public",
    access: [],
    hashTx: "0xdef...456",
  },
]

export function NamespaceTable() {
  const [activeTab, setActiveTab] = useState<"my-data" | "shared">("my-data")
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<"All" | "Public" | "Private">("All")

  const filterData = (data: NamespaceData[]) => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) && (typeFilter === "All" || item.type === typeFilter),
    )
  }

  const filteredMyData = filterData(myData)
  const filteredSharedData = filterData(sharedData)

  const renderTable = (data: NamespaceData[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name/Path</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Access</TableHead>
          <TableHead>Hash TX</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {item.type === "Private" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </TooltipTrigger>
                  <TooltipContent>
                    {item.type === "Private" ? `Authorized: ${item.access.join(", ")}` : "Public access"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell>{item.hashTx}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "my-data" | "shared")}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="my-data">My Data</TabsTrigger>
          <TabsTrigger value="shared">Shared with Me</TabsTrigger>
        </TabsList>
        <div className="flex space-x-2">
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select onValueChange={(value: "All" | "Public" | "Private") => setTypeFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Public">Public</SelectItem>
              <SelectItem value="Private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <TabsContent value="my-data" className="mt-0">
        {renderTable(filteredMyData)}
      </TabsContent>
      <TabsContent value="shared" className="mt-0">
        {renderTable(filteredSharedData)}
      </TabsContent>
    </Tabs>
  )
}

