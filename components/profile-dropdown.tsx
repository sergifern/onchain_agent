import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePrivy } from "@privy-io/react-auth";
import { Bot, LogOut, Menu, Link } from "lucide-react"
import { useRouter } from "next/navigation"

export function ProfileDropdown() {
  const router = useRouter();
  const { logout, user, ready, authenticated } = usePrivy()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-secondary hover:bg-transparent md:px-4 px-2">
          <Menu className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 shadow-xl border-none shadow-dark bg-card mr-6">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
              Settings
              <DropdownMenuShortcut>
                <Bot className="w-4 h-4" />
              </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Block Explorer
          <DropdownMenuShortcut>
            <Link className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          Log out
          <DropdownMenuShortcut>
            <LogOut className="w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
