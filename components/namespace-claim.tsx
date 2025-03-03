import { getAccessToken, usePrivy, useWallets } from "@privy-io/react-auth";
import { Avatar, Name, Address, useName } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";
import { Button } from "./ui/button";
import { BadgeCheck, Loader2 } from "lucide-react";
import { usePrivyLogin } from "@/hooks/privy-hooks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import {useSetActiveWallet} from '@privy-io/wagmi';
import { sendTransaction } from '@wagmi/core'
import { config } from '../wagmiConfig';

export default function NamespaceClaim() {
  const { user, authenticated } = usePrivy();
  const {wallets, ready} = useWallets();
  const { setActiveWallet } = useSetActiveWallet();
  const [confirmedTx, setConfirmedTx] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { login } = usePrivyLogin();

  const [isMinted, setIsMinted] = useState<boolean | null>(null);
  const [loadingMintCheck, setLoadingMintCheck] = useState(true);
  

  const mainAccount = user?.linkedAccounts.find(
    (acc) => acc.type === "wallet" && acc.connectorType !== "embedded"
  );
  

  const injectedWallet = wallets.find((wallet) => wallet.walletClientType !== 'privy' && wallet.chainId == "eip155:8453");

  const { data: name, isLoading: nameIsLoading } = useName({ address: injectedWallet?.address as `0x${string}`, chain: base });

  useEffect(() => {
    const checkNamespaceMintStatus = async () => {
      if (injectedWallet?.address) {
        try {
          const accessToken = await getAccessToken(); // Get access token
          const response = await fetch(`/api/users/namespace?address=${injectedWallet.address}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
  
          const data = await response.json();
          setIsMinted(data.minted);
        } catch (err) {
          console.error("Error checking namespace mint status:", err);
        } finally {
          setLoadingMintCheck(false);
        }
      }
    };
  
    checkNamespaceMintStatus();
  }, [injectedWallet]);
  


  // Update namespace status to minted once the transaction is confirmed
  useEffect(() => {
    const updateNamespaceStatus = async () => {
      if (confirmedTx && injectedWallet?.address) {
        try {
          const accessToken = await getAccessToken();
          const response = await fetch("/api/users/namespace", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ address: injectedWallet.address, claimed: true, name: name }),
          });
  
          const data = await response.json();
          if (data.success) {
            setIsMinted(true);
          }
        } catch (err) {
          console.error("Error updating namespace status:", err);
        }
      }
    };
  
    updateNamespaceStatus();
  }, [confirmedTx]);
  

  const handleMintNamespace = async () => {
    if (!injectedWallet?.address) return;
    await setActiveWallet(injectedWallet);

    try {
      setIsConfirming(true);
      const tx = await sendTransaction(config, {
        to: "0x1f294306d01546a4cd5E62F3c165c5B7B31C7F83", // Dirección del contrato de mint
        value: parseEther("0.0001"),
        chainId: base.id,
      });
      if (tx) {
        setTimeout(() => {
          setConfirmedTx(true);
          setIsConfirming(false);
        }, 1000);
      }
      
      
    } catch (err) {
      console.error("Error minting namespace:", err);
    }
  };

  if (!ready) {
    return null;
  }

  if (!authenticated) {
    return (
      <Button variant="outline" className="w-full" onClick={login}>
        Connect Wallet
      </Button>
    );
  }

  if (loadingMintCheck) {
    return <div className="flex gap-2 items-center"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>;
  }


  return (
    <>
    {isMinted && <MintedNamespace name={name} />}
    {!isMinted && <div className="flex gap-2 items-center">
      <div className="items-center">
        <div className="flex items-center gap-3 mb-4">
          <Avatar address={injectedWallet?.address as `0x${string}`} chain={base} /> 
          <div className="flex flex-col gap-0">
            <Name address={injectedWallet?.address as `0x${string}`} chain={base} />
            <Address address={injectedWallet?.address as `0x${string}`} />
          </div>
        </div>
        <Button variant="default" onClick={handleMintNamespace} disabled={isConfirming}>
          {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Claim Namespace'}
        </Button>
      </div>
    </div>}
    </>
  );
}


const MintedNamespace = ({name}: {name: string}) => {
  return <div className="flex gap-2 items-center">
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
          <BadgeCheck className="w-7 h-7 text-violeta" />
        </TooltipTrigger>
        <TooltipContent className="border-0 bg-background">
          <p>Namespace claimed</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <p className="text-xl font-light text-white">{name}</p>
  </div>;
}