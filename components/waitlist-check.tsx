"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { fakeRequest } from "@/lib/utils"
import { usePrivy } from "@privy-io/react-auth";
import { usePrivyLogin } from "@/hooks/privy-hooks";
import { Loader2 } from "lucide-react";
import { useAccount, useBalance } from "wagmi";


export function WaitlistCheck() {
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { ready, authenticated } = usePrivy();
  const { login } = usePrivyLogin();
  const disableLogin = !ready || (ready && authenticated);
  const { address } = useAccount();

  const EthyBalance = useBalance({
    address: address,
    token: process.env.NEXT_PUBLIC_ETHY_TOKEN_ADDRESS as `0x${string}`, 
  })  
  

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
    return null;
  }

  if (!authenticated) {
    return (
      <Button disabled={disableLogin} onClick={login} className="mt-6">
        Connect
      </Button>
    );
  }

  if(isOnWaitlist) {
    return (
      <p className="mt-6 text-sm text-secondary">You are already on the waitlist. Come back soon!</p>
    );
  }
  if (EthyBalance.data?.formatted && Number(EthyBalance.data?.formatted) < 3000000) {
    return (
      <div className="flex flex-col items-center">
        <Button disabled={true} className="mt-8">
          {"Request Access"}
        </Button>
        <p className="mt-6 text-white font-semibold">You need to own at least 3m $ETHY to request access.</p>
      </div>
    );
  }

  
  return(isLoading ?
    <Loader2 className="w-4 h-4 animate-spin mt-6" /> :
    <Button onClick={handleRequest} disabled={loading} className="mt-6">
      {loading ? "Processing..." : "Request Access"}
    </Button>)
}
