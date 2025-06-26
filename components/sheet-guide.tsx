import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"


export default function SheetGuide() {
  return (
    <Sheet>
      <SheetTrigger className="ml-0">
        <div className="pt-4 text-sm flex flex-row items-center gap-2 group/item">
          Read more
          <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/item:translate-x-1" />
        </div>
      </SheetTrigger>
      <SheetContent className="bg-background rounded-2xl border-none m-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="">
          <SheetHeader>
            <SheetTitle>How it works?</SheetTitle>
            <SheetDescription>
              <p>First af all, you need to connect your wallet.</p>

              <br />

              <span className="font-bold">1) How to connect your wallet?</span>
              <p>
                To connect your wallet, you need to click on the Connect Wallet button.
              </p>

              <br />

              <span className="font-bold">How to connect your wallet?</span>
              <p>
                To connect your wallet, you need to click on the Connect Wallet button.
              </p>
            </SheetDescription>
          </SheetHeader>
        </div>
      </SheetContent>
    </Sheet>
  )
}