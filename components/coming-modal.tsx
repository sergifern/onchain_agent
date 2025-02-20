import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-secondary/40">
        <DialogHeader>
          <DialogTitle>Coming Soon</DialogTitle>
          <DialogDescription>This feature is not available yet. Stay tuned for updates!</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

