
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github, Twitter, PlusCircle, Loader2, CheckCircle2, BadgeCentIcon, BadgeCheckIcon } from "lucide-react";
import { Address, getAddress, Name, Socials, useName } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { Avatar, Badge as BadgeCheck } from "@coinbase/onchainkit/identity";
import { useEffect } from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";


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
      <Card className="p-6 namespace-card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-4 items-center">
              <div className="flex items-center gap-3">
                <Avatar address={address as `0x${string}`} chain={base} className="w-16 h-16" /> 
                <div className="flex flex-col gap-0">
                  <div className="flex items-center gap-2">
                    <Name address={address as `0x${string}`} chain={base} className="text-2xl" />
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
              <Badge variant={isClaimed ? "default" : "secondary"}>{isClaimed ? "Claimed" : ""}</Badge>
              <span className="text-md text-white">0 documents</span>
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


interface Namespace {
  id: string;
  name: string;
  owner: `0x${string}`;
  claimed: boolean;
  documents: number;
  twitter_verified: boolean;
}



export function ListProfileCard({ namespace }: { namespace: Namespace }) {
  const router = useRouter();
  
  
  /*const address = '0x1234567890abcdef1234567890abcdef12345678';
  const attestationsOptions = {
    schemas: [COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID],
  };
    
  const attestations = await getAttestations(address, base, attestationsOptions);*/

  return (
    <div onClick={() => router.push(`/namespace/explore/${namespace.name}.base.eth`)} key={namespace.id}>
    <Card className="namespace-card p-6 space-y-4 cursor-pointer min-h-48">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar address={namespace.owner} chain={base} /> 
          <div className="flex flex-col gap-0">
            <div className="flex items-center gap-2">
              <Name className="text-white" address={namespace.owner} chain={base} />
            </div>
            <Address className="text-muted-foreground" address={namespace.owner} />
          </div>
        </div>
        {namespace.twitter_verified && (
          <div className="flex items-center gap-2">
            <BadgeCheckIcon className="w-5 h-5 text-violeta" />
            <span className="text-sm text-muted-foreground">Verified</span>
          </div>
        )}
      </div>

      {namespace.claimed ? (
        <div className="flex items-center gap-3">
          <Badge variant="default">Claimed</Badge>
          <span className="text-sm text-muted-foreground">{namespace.documents} documents</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">0 documents</span>
        </div>
      )}

      <div className="flex items-baseline gap-4 text-muted-foreground">
        <Socials
          address={namespace.owner}
          chain={base}
        /> 
      </div>

      {/*ns.isOwner && (
        <div className="top-3 right-3">
          <Badge variant="outline" className="border-violet-400 text-violet-400">
            Your Namespace
          </Badge>
        </div>
      )*/}
    </Card>
  </div>
  )
}
