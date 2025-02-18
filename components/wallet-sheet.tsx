import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { usePrivy } from "@privy-io/react-auth"
import { Wallet } from "lucide-react"
import { DelegateActionButton } from "./delegate-actions-button"
import { LinkedAccounts } from "./linked-accounts"


export function WalletSheet() {
  const { user, logout, linkTwitter, ready, authenticated } = usePrivy()

  console.log(user)
  if (!(ready && authenticated) || !user) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="text-secondary h-7 w-7" size="icon">
          <Wallet className="text-secondary" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <p>User {user.id} has linked the following accounts:</p>
          <ul>
            <li>Email: {user.email ? user.email.address : 'None'}</li>
            <li>Farcaster: {user.farcaster ? user.farcaster.username : 'None'}</li>
            <li>Spotify: {user.spotify ? user.spotify.email : 'None'}</li>
            <li>Twitter: {user.twitter ? user.twitter.username : 'None'}</li>
            <li>Wallet: {user.wallet ? user.wallet.address : 'None'}</li>
            {user.linkedAccounts.map((account) => (
              <li key={account.type}>{account.type}: {account?.address || account?.username}</li>
            ))  }
          </ul>
        <Button onClick={linkTwitter} disabled={!ready || !authenticated || !!user?.twitter}>
          Link your Twitter
        </Button>

        <LinkedAccounts accounts={user.linkedAccounts} mainAccount="wallet" />


          <Button onClick={logout} variant="destructive">
            Logout
          </Button>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
