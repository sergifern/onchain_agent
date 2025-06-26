import AgentCard from "@/components/agent-card";
import AgentTable from "@/components/agent-tasks-table";
import TwitterConnectionCard from "@/components/twitter-connection-card";
import PageContainer from "@/components/page-container";
import AgentHoldings from "@/components/agent-holdings";
import AgentPage from "@/components/agent-page";
import PageLoader from "@/components/page-loader";

export default function Agent() {
  return (
    <PageContainer title="My Agent" description="Manage your agent and tasks">
      <div className="max-w-6xl mx-auto">
        <AgentPage />
      </div>
    
    </PageContainer>
  )
}
