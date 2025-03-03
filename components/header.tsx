"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Settings, SquarePlus } from "lucide-react"
import { useAccount, useBalance } from "wagmi";
import { truncateAddress, formatEthyAmount } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { WalletSheet } from "@/components/wallet-sheet";
import { ProfileDropdown } from "@/components/profile-dropdown";

export function Header() {
  const { login, authenticated, user } = usePrivy()
  const router = useRouter();
  const { address } = useAccount();

  const EthyBalance = useBalance({
    address: address,
    token: process.env.NEXT_PUBLIC_ETHY_TOKEN_ADDRESS as `0x${string}`, 
  })  
  
  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <SidebarTrigger className="text-white border-[1px] border-secondary p-4" />
        </div>
        <div className="items-center sm:!flex hidden">
          <Button variant="ghost" className="text-white/60 border-[1px] border-secondary p-4 h-7 w-7" size="icon" onClick={() => {
            router.push("/terminal")
          }}>
            <SquarePlus className=" text-white " />
          </Button>
        </div>
      </div>

      <div className="flex items-center md:!gap-6 gap-4">
        <div className="flex items-center text-secondary sm:!text-sm text-xs">
          {formatEthyAmount(Number(EthyBalance.data?.formatted ?? 0))} ETHY
        </div>
        <Separator orientation="vertical" className="h-4 bg-white/20" />

        {authenticated ? (
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-connected rounded-full bg-emerald-600 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-600"></span>
            </span>
            <span className="text-secondary md:!text-sm text-xs">{truncateAddress(address)}</span>
            <ProfileDropdown />
          </div>
        ) : (
          <Button onClick={login}>Connect</Button>
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
            <span className="hidden lg:!inline-block">{data.user.name}</span>
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

