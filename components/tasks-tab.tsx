import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function TasksTab() {
  const tasks = [
    { id: 120, task: "Buy 0.01 ETH every minute", type: "Recurring Purchase", asset: "ETH", status: true, lastExecution: "2025-02-21 13:15", cost: "10,000" }, 
    ]

  return (
    <Table>
      <TableHeader> 
        <TableRow> 
          <TableHead>ID</TableHead> 
          <TableHead>Task</TableHead> 
          <TableHead>Type</TableHead>
          <TableHead>Asset</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Credits</TableHead>
          <TableHead>Last Execution</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              No tasks found. <Link href="/terminal" className=" hover:underline">Use the Terminal to create tasks.</Link>
            </TableCell>
          </TableRow>
        )}
        
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.id}</TableCell>
            <TableCell className="font-medium">{task.task}</TableCell>
            <TableCell>
              <Badge className=" bg-white/90">{task.type}</Badge>
            </TableCell>
            <TableCell>{task.asset}</TableCell>
            <TableCell>
              <Switch checked={task.status} />
            </TableCell>
            <TableCell className="text-sm">{`${task.cost} ETHY`}</TableCell>
            <TableCell>{task.lastExecution}</TableCell>
            <TableCell>
              <Button variant="outline" size="icon" className="mr-2">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

