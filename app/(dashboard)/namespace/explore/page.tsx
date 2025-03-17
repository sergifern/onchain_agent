"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, OctagonAlert, Terminal } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { ListProfileCard } from "@/components/namespaces/profile-card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

async function fetchData({ page, search, filters }: { page: number; search: string, filters: string[] }) {
  const res = await fetch(`/api/namespace?page=${page}&search=${search}&filters=${filters.join(",")}`)
  return res.json()
}

const FILTERS = ["AI Agents", "Business", "Builders", "Team"]

export default function PaginatedList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [query, setQuery] = useState("") // Holds the submitted search value
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const { data, isLoading, isError } = useQuery({
    queryKey: ["basenames", page, query, selectedFilters],
    queryFn: () => fetchData({ page, search: query, filters: selectedFilters }),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  const totalPages = data?.totalPages || 1

  const handleSubmit = () => {
    setQuery(search) // Update search query on button click
    setPage(1) // Reset page to 1 on new search
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    )
  }

  const getPageNumbers = () => {
    const maxPagesToShow = 3
    let start = Math.max(1, page - Math.floor(maxPagesToShow / 2))
    let end = Math.min(totalPages, start + maxPagesToShow - 1)

    if (totalPages > maxPagesToShow && end === totalPages) {
      start = Math.max(1, totalPages - maxPagesToShow + 1)
    }

    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto mb-12">
      <h1 className="text-3xl mb-6 font-semibold text-center">Namespace Explorer</h1>

      <div className="flex gap-2 max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Search a Basename..."
          onChange={(e) => setSearch(e.target.value)}
          className="border-white/60 placeholder:text-white/60"
        />
        <Button onClick={handleSubmit}>Search</Button>
      </div>


      <div className="flex gap-2 justify-center mt-4">
        {FILTERS.map((filter) => (
          <TooltipProvider key={filter}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    key={filter}
                    className={`px-3 py-1 rounded-lg hover:bg-violeta/20 ${selectedFilters.includes(filter) ? "bg-violeta text-white" : "bg-transparent text-violeta border border-violeta"}`}
                    //onClick={() => toggleFilter(filter)}
              >
                {filter}
              </Badge>
              </TooltipTrigger>
              <TooltipContent className="bg-sidebar border-none">
                <p>Coming soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {isLoading && <Loader2 className="w-4 h-4 animate-spin mx-auto" />}
      {isError && <p className="text-center text-red-500">Error loading data</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.basenames?.map((ns: any) => (
          <ListProfileCard key={ns.id} namespace={ns} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {/* First Page */}
            {page > 3 && (
              <>
                <PaginationItem>
                  <PaginationLink href="#" onClick={() => setPage(1)}>1</PaginationLink>
                </PaginationItem>
                <PaginationItem><PaginationEllipsis /></PaginationItem>
              </>
            )}

            {/* Dynamic Page Numbers */}
            {getPageNumbers().map((num) => (
              <PaginationItem key={num}>
                <PaginationLink
                  href="#"
                  isActive={page === num}
                  onClick={() => setPage(num)}
                >
                  {num}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Last Page */}
            {page < totalPages - 2 && (
              <>
                <PaginationItem><PaginationEllipsis /></PaginationItem>
              </>
            )}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Alert className="border-secondary">
        <OctagonAlert className="h-5 w-5 !text-muted-foreground" />
        <AlertTitle className="text-muted-foreground">Upgrades in Progress!</AlertTitle>
        <AlertDescription className="text-secondary">
        We are working on enhancements to bring you a better experience. Currently, we are adding more Basenames to ensure all are available and improving categorization and search functionalities. Stay tuned for updates!
        </AlertDescription>
      </Alert>
    </div>
  )
}
