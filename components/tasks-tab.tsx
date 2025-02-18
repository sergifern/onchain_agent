import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
export default function TasksTab() {
  const tasks = [
    { id: 1, task: "Transfer 500 USDC to nikk.base.eth every Monday", type: "Transfer", asset: "USDC", status: true, lastExecution: "2025-01-06 14:30", cost: "10,000" },
    { id: 2, task: "Eye Future: $AIXBT at $0.18 , SL at $0.35", type: "Forecast", asset: "AIXBT", status: false, lastExecution: "2025-01-05 09:15", cost: "25,000" },
    { id: 3, task: "Buy 0.5 ETH every time price increases by 5% in 24 hours", type: "Trading", asset: "ETH", status: false, lastExecution: "2025-01-05 18:41", cost: "10,000" },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
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
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.task}</TableCell>
            <TableCell>
              <Badge className=" bg-white/90">{task.type}</Badge>
            </TableCell>
            <TableCell>{task.asset}</TableCell>
            <TableCell>
              <Switch checked={task.status} />
            </TableCell>
            <TableCell className="text-sm">{`${task.cost} $ETHY`}</TableCell>
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

