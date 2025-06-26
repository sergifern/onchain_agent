import PageContainer from "@/components/page-container";
import { Info } from "lucide-react";



export default function VirtualsProtocol() {
  return (
    <PageContainer title="Virtuals Protocol" description="Create a bid for a creator">

        <div className="flex flex-col ">
          <div className="flex flex-row items-center gap-2 mb-2">
            <Info className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Coming soon</h1>
          </div>
          <p className="text-muted-foreground">Here you’ll find all listed agents on Virtuals Protocol, along with upcoming Genesis launches.
          <br />
          Ask Ethy to define DCA rules, set up staking automations, or implement other strategies for those agents in a easy way.</p>
        </div>
    </PageContainer>
  )
}