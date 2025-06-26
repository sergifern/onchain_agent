'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ListTodo, Plus, Pencil, Trash2, Power, Loader2 } from "lucide-react"
import { useState } from "react"
import TasksTab from "./tasks-tab"
import ExecutionHistory from "./execution-history"
import TransactionsTab from "./transactions-tab"
import Link from "next/link"
import { useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import PageLoader from "./page-loader"

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

export default function AgentTable() {
  const { getAccessToken } = usePrivy()
  const [activeTab, setActiveTab] = useState("tasks")
  const [tasks, setTasks] = useState<any[]>([])
  const [executions, setExecutions] = useState<Execution[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingExecutions, setIsLoadingExecutions] = useState(false);
  const [agent, setAgent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [executionsLoaded, setExecutionsLoaded] = useState(false);

  const fetchExecutions = async () => {
    if (executionsLoaded) return; // Don't fetch if already loaded
    
    try {
      setIsLoadingExecutions(true)
      const accessToken = await getAccessToken()
      const response = await fetch('/api/users/agents/executions', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch executions')
      }

      const data = await response.json()
      setExecutions(data.executions || [])
      setExecutionsLoaded(true)
    } catch (err) {
      console.error('Error fetching executions:', err)
    } finally {
      setIsLoadingExecutions(false)
    }
  }

  // Fetch executions when switching to execution tab
  useEffect(() => {
    if (activeTab === "execution" && agent) {
      fetchExecutions()
    }
  }, [activeTab, agent])

  useEffect(() => {
    const getAgent = async () => {
      try {
        setIsLoading(true);
        const accessToken = await getAccessToken();
        const response = await fetch(`/api/users/agents`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        setAgent(data.agent);

      } catch (err) {
        console.error("Error checking namespace mint status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTasks = async () => {
      const accessToken = await getAccessToken()
      const response = await fetch('/api/users/agents/tasks', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      console.log(data.tasks)
      setTasks(data.tasks)
    }

    getAgent();
    fetchTasks();

  }, []);

  const getTypeBadge = (type: string) => {
    const colors = {
      buy: "bg-green-500/10 text-emerald-600",
      sell: "bg-red-500/10 text-red-600",
      'buy-and-stake': "bg-blue-500/10 text-blue-600",
    }
    return (
      <Badge className={`${colors[type as keyof typeof colors] || 'bg-gray-500/10 text-gray-500'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  const getFrequencyBadge = (frequency: string) => {
    return (
      <Badge className="border border-gray-200/20 bg-gray-500/20 text-white">
        {frequency.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    )
  }

  const handlePowerClick = (task: any) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDeleteClick = (task: any) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
  };

  const handleToggleStatus = async () => {
    if (!selectedTask) return;
    
    try {
      setIsToggling(true);
      const accessToken = await getAccessToken();
      const newStatus = selectedTask.status === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(`/api/users/agents/tasks/${selectedTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update task status');
      }

      // Update the task in the local state
      setTasks(prevTasks => 
        prevTasks.map((task: any) => 
          task._id === selectedTask._id 
            ? { ...task, status: newStatus }
            : task
        )
      );

      toast({
        title: "Success",
        description: `Task ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      });
      
      setDialogOpen(false);
      setSelectedTask(null);
      
    } catch (error) {
      console.error('Error toggling task status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update task status',
      });
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    try {
      setIsDeleting(true);
      const accessToken = await getAccessToken();
      
      const response = await fetch(`/api/users/agents/tasks/${selectedTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          isDeleted: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete task');
      }

      // Remove the task from the local state
      setTasks(prevTasks => 
        prevTasks.filter((task: any) => task._id !== selectedTask._id)
      );

      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      
      setDeleteDialogOpen(false);
      setSelectedTask(null);
      
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete task',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    if (status === 'active') {
      return (
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <span className="text-sm text-emerald-600 font-medium">Active</span>
        </div>
      );
    }
    return <span className="text-sm text-gray-400">Inactive</span>;
  };

  const formatExecutionTime = (dateString: string | null, isNext: boolean = false) => {
    if (!dateString) {
      return <span className="text-xs text-gray-400">-</span>;
    }

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    // For next execution (future dates)
    if (isNext) {
      if (diffMinutes < 60 && diffMinutes > 0) {
        return <span className="text-md">in {diffMinutes}m</span>;
      } else if (diffHours < 24 && diffHours > 0) {
        return <span className="text-md">in {diffHours}h</span>;
      } else if (diffDays > 0) {
        return <span className="text-md">in {diffDays}d</span>;
      } else {
        return <span className="text-md animate-pulse">processing...</span>;
      }
    }

    // For last execution (past dates)
    const pastDiffMinutes = Math.abs(diffMinutes);
    const pastDiffHours = Math.abs(diffHours);
    const pastDiffDays = Math.abs(diffDays);

    if (pastDiffMinutes < 60) {
      return <span className="text-md">{pastDiffMinutes}m ago</span>;
    } else if (pastDiffHours < 24) {
      return <span className="text-md">{pastDiffHours}h ago</span>;
    } else {
      return <span className="text-md">{pastDiffDays}d ago</span>;
    }
  };


  if (isLoading) {
    return <PageLoader />
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center">
        <TabsList className="">
          <TabsTrigger value="tasks">
            <span className="flex items-center">
              <ListTodo className="h-5 w-5 mr-2" />
              Scheduled
            </span>
          </TabsTrigger>
          <TabsTrigger value="execution">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20v-6M6 20V10M18 20V4" />
              </svg>
              Execution History
            </span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="hidden">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Transactions
            </span>
          </TabsTrigger>
        </TabsList>
        <Link href="/agent/tasks/add" className="flex px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Automation
        </Link>
      </div>
      <TabsContent value="tasks">
        {!agent ? (
          <div className="flex items-center mt-12 gap-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">Agent not deployed, first <Link href="/agent" className="text-violeta hover:underline hover:text-violeta/80">create your agent</Link></p>
          </div>
        ) : tasks.length === 0 || !tasks ? (
          <div className="flex items-center mt-12 gap-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No automations found. Create your first automation!</p>
          </div>
        ) : (
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last / Next</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Base Currency</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task: any) => (
                  <TableRow key={task._id}>
                    <TableCell className="font-medium text-muted-foreground">{task._id.slice(-4)}</TableCell>
                    <TableCell>{getStatusDisplay(task.status)}</TableCell>
                    <TableCell>{formatExecutionTime(task.lastExecutionTime, false)} / {formatExecutionTime(task.nextExecutionTime, true)}</TableCell>
                    <TableCell>{getFrequencyBadge(task.frequency)}</TableCell>
                    <TableCell>{getTypeBadge(task.type)}</TableCell>
                    <TableCell>{task.amount}</TableCell>
                    <TableCell>{task.asset?.symbol || 'N/A'}</TableCell>
                    <TableCell>{task.baseCurrency?.symbol || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate">{task.condition}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/agent/tasks/edit/${task._id}`}>
                          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-gray-600">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handlePowerClick(task)}
                          className={task.status !== 'active' ? 'text-emerald-600 hover:text-emerald-700' : 'text-gray-300 hover:text-gray-600'}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteClick(task)}
                          className="text-gray-300 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>
      <TabsContent value="execution">
        {!agent ? (
          <div className="flex items-center mt-12 gap-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">Agent not deployed, first <Link href="/agent" className="text-violeta hover:underline hover:text-violeta/80">create your agent</Link></p>
          </div>
        ) : (
          <ExecutionHistory 
            executions={executions}
            isLoading={isLoadingExecutions}
          />
        )}
      </TabsContent>
      <TabsContent value="transactions">
        {!agent ? (
          <div className="flex items-center mt-12 gap-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">Agent not deployed, first <Link href="/agent" className="text-violeta hover:underline hover:text-violeta/80">create your agent</Link></p>
          </div>
        ) : (
          <div className="flex items-center mt-12 gap-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">Under development. Come back soon!</p>
          </div>
        )}
      </TabsContent>
      
      {/* Status Toggle Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="border-none bg-card text-card-foreground card-outline">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedTask?.status === 'active' ? 'Stop' : 'Start'} Task
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedTask?.status === 'active' 
                ? 'Are you sure you want to stop this Smart Automation? It will stop executing automatically.'
                : 'Are you sure you want to start this Smart Automation? It will start executing automatically based on its schedule.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isToggling}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              disabled={isToggling}
              className={selectedTask?.status === 'active' 
                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-600' 
                : 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-600'
              }
            >
              {isToggling ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {selectedTask?.status === 'active' ? 'Deactivating...' : 'Activating...'}
                </div>
              ) : (
                selectedTask?.status === 'active' ? 'Deactivate' : 'Activate'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-none bg-card text-card-foreground card-outline">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Delete Smart Automation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Smart Automation? This action cannot be undone and the automation will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-600"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting...
                </div>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  )
}
