"use client"

import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { usePrivyLogin } from "@/hooks/privy-hooks"; // Importamos nuestro hook personalizado

export default function Home() {
  const { ready, authenticated, user, logout } = usePrivy();
  const { login } = usePrivyLogin();

  const disableLogin = !ready || (ready && authenticated);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Ethy AI</h1>
      <p className="text-xl mb-8">Manage your wallet and settings with ease</p>
          
      <div>
        {authenticated ? (
          <span>Welcome, {user?.email || user?.wallet?.address}</span>
        ) : (
          <Button disabled={disableLogin} onClick={login}>Connect</Button>
        )}
      </div>
      <Button onClick={logout} variant="destructive">
        Logout
      </Button>
    </div>
  );
}
