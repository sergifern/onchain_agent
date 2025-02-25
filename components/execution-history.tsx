import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText } from "lucide-react"
import { truncateAddress, truncateHash } from "@/lib/utils"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
export default function ExecutionHistory() {
  const executions = [
    { id: 120, taskId: 120, date: "2025-02-21 13:16", action: "Bought 0.1 ETH at $2,743", result: "Success", fee: "10,000", hash: "0xeb8282906f47a136536f2a3db3f71c54b2cd65c77a427fd49dff313c5b0e0106" },
    { id: 120, taskId: 120, date: "2025-02-21 13:17", action: "Bought 0.1 ETH at $2,746", result: "Success", fee: "10,000", hash: "0x7c0efebcce5c0944137bfde5baa3406acbb17b87b8bb15c821d17df1b7325f7e" }, 
    { id: 120, taskId: 120, date: "2025-02-21 13:18", action: "Bought 0.1 ETH at $2,749", result: "Success", fee: "10,000", hash: "0xb7b7d7a5ee20767b77addef2e66a0d35cacd9f24dce8629e88421638c4afc133" },
    { id: 120, taskId: 120, date: "2025-02-21 13:19", action: "Bought 0.1 ETH at $2,748", result: "Success", fee: "10,000", hash: "0x65ffca8a0e7f6b6f5f09e01af084d61d61f6953b51fc2360bb1c719a4313ab9d" },
    //{ id: 120, taskId: 120, date: "2025-02-21 13:19", action: "Bought 0.01 ETH at $2,500", result: "Success", fee: "10,000", hash: "0x65ffca8a0e7f6b6f5f09e01af084d61d61f6953b51fc2360bb1c719a4313ab9d" },
    //{ id: 120, taskId: 120, date: "2025-02-21 13:19", action: "Bought 0.01 ETH at $2,500", result: "Success", fee: "10,000", hash: "0x65ffca8a0e7f6b6f5f09e01af084d61d61f6953b51fc2360bb1c719a4313ab9d" },
    //{ id: 120, taskId: 120, date: "2025-02-21 13:19", action: "Bought 0.01 ETH at $2,500", result: "Success", fee: "10,000", hash: "0x65ffca8a0e7f6b6f5f09e01af084d61d61f6953b51fc2360bb1c719a4313ab9d" },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Execution Time</TableHead>
          <TableHead>Task ID</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Result</TableHead>
          <TableHead>Credits</TableHead> 
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {executions.map((execution) => (
          <TableRow key={execution.id}>
            <TableCell>{execution.date}</TableCell> 
            <TableCell>{execution.taskId}</TableCell>  
            <TableCell>{execution.action}</TableCell> 
            <TableCell className={execution.result === "Success" ? "text-emerald-500" : "text-red-500"}>
              <Badge className={execution.result === "Success" ? "bg-emerald-500" : "bg-red-500"}>
                {execution.result}
              </Badge>
            </TableCell>
            <TableCell>{execution.fee} ETHY</TableCell>
            <TableCell>
              <Link href={`https://etherscan.io/tx/${execution.hash}`} target="_blank" className="flex items-center gap-2">
                {truncateHash(execution.hash)}
                <ExternalLink className="w-4 h-4" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

