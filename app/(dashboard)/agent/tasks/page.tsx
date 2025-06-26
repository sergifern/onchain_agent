import PageContainer from "@/components/page-container";
import AgentTable from "@/components/agent-tasks-table";

export default async function AgentTasks  () {


  return (
    <PageContainer title="Smart Automations" description="Manage your agent and tasks">
      <AgentTable />
    </PageContainer>
  )
}
