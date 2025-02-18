"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { fakeRequest } from "@/lib/utils"
import { usePrivy } from "@privy-io/react-auth";
import { usePrivyLogin } from "@/hooks/privy-hooks";
import { Loader2 } from "lucide-react";
export function WaitlistCheck() {
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { ready, authenticated } = usePrivy();
  const { login } = usePrivyLogin();
  const disableLogin = !ready || (ready && authenticated);

  useEffect(() => {
    const checkWaitlist = async () => {
      const result = await fakeRequest();
      setIsOnWaitlist(result as boolean);
      setIsLoading(false);
    };
    checkWaitlist();
  }, []);

  const handleRequest = async () => {
    setLoading(true);
    await fakeRequest();
    setIsOnWaitlist(true);
  };

  if (!ready) {
    return null; // No muestra nada hasta que esté listo Privy
  }

  if (!authenticated) {
    return (
      <Button disabled={disableLogin} onClick={login} className="mt-6">
        Connect
      </Button>
    );
  }

  if (!isOnWaitlist) {
    return(isLoading ?
    <Loader2 className="w-4 h-4 animate-spin mt-6" /> :
     <Button onClick={handleRequest} disabled={loading} className="mt-6">
      {loading ? "Processing..." : "Request Access"}
    </Button>)
  }

  return (
    <p className="mt-6 text-sm text-secondary">You are already on the waitlist. Come back soon!</p>

  );
}
