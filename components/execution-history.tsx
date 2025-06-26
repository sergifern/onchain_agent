"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { truncateAddress, truncateHash } from "@/lib/utils"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Execution {
  _id: string
  taskId: string
  agentId: string
  status: 'success' | 'failed' | 'pending'
  reasoning?: string
  transactionHash?: string
  createdAt: string
  updatedAt: string
}

interface ExecutionHistoryProps {
  executions: Execution[]
  isLoading: boolean
}

export default function ExecutionHistory({ executions, isLoading }: ExecutionHistoryProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRowExpansion = (executionId: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(executionId)) {
      newExpandedRows.delete(executionId)
    } else {
      newExpandedRows.add(executionId)
    }
    setExpandedRows(newExpandedRows)
  }

  const truncateReasoning = (reasoning: string, maxLength: number = 50) => {
    if (reasoning.length <= maxLength) return reasoning
    return reasoning.substring(0, maxLength) + "..."
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (executions.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <span>No executions found yet</span>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Execution Time</TableHead>
          <TableHead>Automation ID</TableHead>
          <TableHead>Reasoning</TableHead>
          <TableHead>Result</TableHead>
          <TableHead>Transaction Hash</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {executions.map((execution) => {
          const isExpanded = expandedRows.has(execution._id)
          const hasReasoning = execution.reasoning && execution.reasoning.length > 0
          const shouldShowToggle = hasReasoning && execution.reasoning!.length > 50

          return (
            <TableRow key={execution._id}>
              <TableCell>
                {new Date(execution.createdAt).toLocaleString()}
              </TableCell> 
              <TableCell>{execution.taskId.slice(-4)}</TableCell>  
              <TableCell className="max-w-md">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      {hasReasoning ? (
                        <div className="text-sm">
                          {isExpanded ? execution.reasoning : truncateReasoning(execution.reasoning!)}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">No action reasoning</span>
                      )}
                    </div>
                    {shouldShowToggle && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(execution._id)}
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 transition-transform duration-200" />
                        ) : (
                          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </TableCell> 
              <TableCell>
                <Badge className={execution.status === "success" ? "bg-emerald-500" : execution.status === "failed" ? "bg-red-500" : "bg-yellow-500"}>
                  {execution.status.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                {execution.transactionHash ? (
                  <Link href={`https://basescan.org/tx/${execution.transactionHash}`} target="_blank" className="flex items-center gap-2 hover:text-violeta transition-colors">
                    {truncateHash(execution.transactionHash)}
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="text-gray-500">No transaction</span>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

