import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export default function ExecutionHistory() {
  const executions = [
    { id: 1, date: "2023-07-01 14:30", action: "Bought 0.01 BTC at $30,000", result: "Success" },
    { id: 2, date: "2023-06-30 09:15", action: "Sold 0.5 ETH at $1,800", result: "Error" },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date & Time</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Result</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {executions.map((execution) => (
          <TableRow key={execution.id}>
            <TableCell>{execution.date}</TableCell>
            <TableCell>{execution.action}</TableCell>
            <TableCell className={execution.result === "Success" ? "text-green-500" : "text-red-500"}>
              {execution.result}
            </TableCell>
            <TableCell>
              <Button variant="outline" size="icon">
                <FileText className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

