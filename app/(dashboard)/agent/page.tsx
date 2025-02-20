import PageContainer from "@/components/page-container"
import { WaitlistCheck } from "@/components/waitlist-check"
import { Flame } from "lucide-react"
export default function ComingSoon() {
  return (
    <PageContainer title="My Agent" description="Handle your own AI agent to automate your tasks">
      <div className="flex flex-col items-center justify-center mt-12 max-w-md mx-auto">
        <span className="pb-2 text-lg font-semibold text-muted-foreground">3m $ETHY required</span>
        <div className="flex flex-row items-baseline gap-2">
          <Flame className="w-8 h-8" />
          <h2 className="text-3xl font-extrabold">Coming Soon</h2>
        </div>
        <p className="mt-2 text-sm text-center">
          We&apos;re open access progressivly to this feature, get ready to be there soon.
          Join our waitlist to be the next!
        </p>
        <WaitlistCheck />
      </div>
    </PageContainer>
  )
}

