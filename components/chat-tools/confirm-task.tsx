import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface TaskConfirmationCardProps {
  action: string
  type: string
  asset: string
  cost: string
  onConfirm: () => void
  onCancel: () => void
}



export default function TaskConfirmationCard({
  action,
  type,
  asset = "ETH",
  cost = "50 ETHY",
  onConfirm,
  onCancel,
}: TaskConfirmationCardProps) {
  return (
    <Card className="w-96 bg-sidebar">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Confirm Smart Automation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">Action</span>
            <span className="text-sm font-medium text-right">{action}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Frequency</span>
            <Badge variant="secondary">{type}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Asset</span>
              {asset}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Cost</span>
            <div className="flex items-center gap-2">
              <Image src={`/img/ETHY_coin_2.png`} alt={asset} width={25} height={25} />
              <span className="text-sm font-mono font-bold">{cost}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="text-white hover:text-destructive-foreground hover:bg-destructive"
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button size="sm" onClick={onConfirm} className="bg-violeta hover:bg-violet-400">
          <Check className="h-4 w-4 mr-1" />
          Confirm
        </Button>
      </CardFooter>
    </Card>
  )
}

