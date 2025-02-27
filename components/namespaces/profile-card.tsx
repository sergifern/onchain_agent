
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github, Twitter, PlusCircle, Loader2 } from "lucide-react";
import { Address, getAddress, Name, Socials } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { Avatar, Badge as BadgeCheck } from "@coinbase/onchainkit/identity";
import { useEffect } from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function ProfileCard({ basename }: { basename: string }) {
  //user state addres
  const [address, setAddress] = useState<`0x${string}` | undefined | null>(undefined);
  const [isClaimed, setIsClaimed] = useState(true);


  console.log(address);
  useEffect(() => {
    const fetchAddress = async () => {
      const address = await getAddress({ name: basename });
      setAddress(address as `0x${string}`);
    };
    fetchAddress();
  }, [basename]);


  return (
    <>
    {address && (
      <Card className="p-6 bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-[#9ca3af] via-violeta/90 to-bg-sidebar border border-solid border-violeta/40">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-4 items-center">
              <div className="flex items-center gap-3">
                <Avatar address={address as `0x${string}`} chain={base} className="w-16 h-16" /> 
                <div className="flex flex-col gap-0">
                  <div className="flex items-center gap-2">
                    <Name address={address as `0x${string}`} chain={base} className="text-2xl" />
                    <BadgeCheck className="w-10 h-10" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <Address address={address as `0x${string}`} className="text-lg" />
                    <Socials
                      address={address as `0x${string}`}
                      chain={base}
                    /> 
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="flex flex-col items-end gap-3">
              <Badge variant={isClaimed ? "default" : "secondary"}>{isClaimed ? "Namespace Claimed" : "Namespace Available"}</Badge>
              <span className="text-md text-white">10 documents</span>
            </div>
        </div>

      </Card>
      )}
      {address === undefined && (
        <div className="flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {address === null && (
        <div className="flex items-center gap-3">
          <p className="text-sm text-zinc-400">Basename not found</p>
        </div>
      )}
  </>
  )
}