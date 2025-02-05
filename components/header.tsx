"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronsUpDown, BadgeCheck, CreditCard, Settings2, LogOut  } from "lucide-react"

const data = {
  user: {
    name: "Nikk.base.eth",
    email: "nikk",
    avatar: "/avatars/shadcn.jpg",
  },
}

export function Header() {
  const { login, authenticated, user } = usePrivy()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>

      <div>
        {authenticated ? (
          <span>Welcome, {`${user?.email}` || user?.wallet?.address}</span>
        ) : (
          <Button onClick={login}>Connect Wallet</Button>
        )}
      </div>

      {/*}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full bg-background p-2 text-sm font-medium shadow-sm ring-1 ring-gray-900/5 hover:bg-gray-50">
            <Avatar className="h-8 w-8">
              <AvatarImage src={data.user.avatar} alt={data.user.name} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="hidden lg:inline-block">{data.user.name}</span>
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{data.user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{data.user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck className="mr-2 h-4 w-4" />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings2 className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>*/}
    </header>
  )
}

