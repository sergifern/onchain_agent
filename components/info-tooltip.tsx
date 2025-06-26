import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";



export default function InfoTooltip({ message }: { message: string }) {
  return (
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-muted-foreground/80" />
      </TooltipTrigger>
      <TooltipContent className="border-none bg-sidebar">
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
    </TooltipProvider>  
  )
}