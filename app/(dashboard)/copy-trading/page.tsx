import PageContainer from "@/components/page-container";


export default function CopyTradingPage() {
  return (
    <PageContainer title="Copy Trading" description="Copy Trading">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Copy Trading</h1>
          <p className="text-sm text-muted-foreground">
            Copy Trading is a feature that allows you to copy the trades of other users.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Copy Trading</h2>
        </div>
      </div>
    </PageContainer>
  )
}