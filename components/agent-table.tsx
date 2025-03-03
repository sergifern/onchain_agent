import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ListTodo } from "lucide-react"
import { useState } from "react"
import TasksTab from "./tasks-tab"
import ExecutionHistory from "./execution-history"
import TransactionsTab from "./transactions-tab"

export default function AgentTable() {
  const [activeTab, setActiveTab] = useState("tasks")

  return (
  <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="">
        <TabsTrigger value="tasks">
          <span className="flex items-center">
          <ListTodo className="h-5 w-5 mr-2" />
            Tasks
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
        <TabsTrigger value="transactions">
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
      <TabsContent value="tasks">
        {/*<TasksTab />*/}
        {/*Under developemnt*/}
        <div className="flex items-center mt-12 gap-2">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Under development. Come back soon!</p>
        </div>
      </TabsContent>
      <TabsContent value="execution">
        {/*<ExecutionHistory />*/}
        {/*Under developemnt*/}
        <div className="flex items-center mt-12 gap-2">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Under development. Come back soon!</p>
        </div>
      </TabsContent>
      <TabsContent value="transactions">
        {/*<TransactionsTab />*/}
        {/*Under developemnt*/}
        <div className="flex items-center mt-12 gap-2">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Under development. Come back soon!</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
