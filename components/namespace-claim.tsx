import { ConnectedWallet, getAccessToken, usePrivy, useWallets } from "@privy-io/react-auth";
import { Avatar, Name, Address, useName } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";
import { Button } from "./ui/button";
import { BadgeCheck, Loader2 } from "lucide-react";
import { usePrivyLogin } from "@/hooks/privy-hooks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import {useSetActiveWallet} from '@privy-io/wagmi';
import { getWalletClient, sendTransaction, switchChain } from '@wagmi/core'
import { config } from '../wagmiConfig';
import { useBalance } from "wagmi"
import Link from "next/link";

export default function NamespaceClaim() {
  const { user, authenticated } = usePrivy();
  const {wallets, ready} = useWallets();
  const { setActiveWallet } = useSetActiveWallet();
  const [confirmedTx, setConfirmedTx] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { login } = usePrivyLogin();

  const [isMinted, setIsMinted] = useState<boolean | null>(null);
  const [loadingMintCheck, setLoadingMintCheck] = useState(true);
  

  const mainAccount: any = user?.linkedAccounts.find(
    (acc) => acc.type === "wallet" && acc.connectorType !== "embedded"
  );
  
  const EthyBalance = useBalance({
    address: mainAccount?.address as `0x${string}`,
    token: process.env.NEXT_PUBLIC_ETHY_TOKEN_ADDRESS as `0x${string}`, 
  })  
  
//  const injectedWallet = wallets.find((wallet) => wallet.walletClientType !== 'privy' && wallet.chainId == "eip155:8453");
  
  const { data: name, isLoading: nameIsLoading } = useName({ address: mainAccount?.address as `0x${string}`, chain: base });

  useEffect(() => {
    const checkNamespaceMintStatus = async () => {
      if (mainAccount?.address) {
        try {
          const accessToken = await getAccessToken(); // Get access token
          const response = await fetch(`/api/users/namespace?address=${mainAccount.address}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
  
          const data = await response.json();
          setIsMinted(data.claimed);
        } catch (err) {
          console.error("Error checking namespace mint status:", err);
        } finally {
          setLoadingMintCheck(false);
        }
      }
    };
  
    checkNamespaceMintStatus();
  }, [mainAccount]);
  


  // Update namespace status to minted once the transaction is confirmed
  useEffect(() => {
    const updateNamespaceStatus = async () => {
      if (confirmedTx && mainAccount?.address) {
        try {
          const accessToken = await getAccessToken();
          const response = await fetch("/api/users/namespace", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ address: mainAccount.address, claimed: true, name: name }),
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
    if (!mainAccount?.address) return;

    const newActiveWallet = wallets.find((wallet) => wallet.address === mainAccount.address);

    //console.log(newActiveWallet);
    await setActiveWallet(newActiveWallet as ConnectedWallet);

    try {
      const walletClient = await getWalletClient(config, {
        account: mainAccount.address as `0x${string}`,
      });
  
      if (!walletClient) {
        console.error("No wallet client available");
        return;
      }
  
      const currentChainId = await walletClient.getChainId();
  
      if (currentChainId !== base.id) {
        const confirmed = confirm(`You are connected to the wrong network. Switch to Base chain to proceed?`);
        if (!confirmed) {
          return;
        }
  
        await switchChain(config, {
          chainId: base.id,
        });
      }
      
      setIsConfirming(true);
      const tx = await sendTransaction(config, {
        to: process.env.NEXT_PUBLIC_PAYMENT_ADDRESS as `0x${string}`, // Dirección del contrato de mint
        value: parseEther("0.001"),
        chainId: base.id,
      });
      if (tx) {
        //console.log(tx);
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
      <Button className="button-filled"   onClick={login}>
        Connect Wallet
      </Button>
    );
  }

  if (loadingMintCheck) {
    return <div className="flex gap-2 items-center"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>;
  }

  if (Number(EthyBalance.data?.formatted) < 2000000) {
    return <div className="flex flex-col gap-2 items-center">
      <p className="text-md font-light text-white">Not enough ETHY to claim namespace. 2m $ETHY required</p>
      <Link href="/swap" className="text-violeta">Buy more</Link>
    </div>
  }

  //console.log(isMinted);

  return (
    <>
      {isMinted ? (
        <MintedNamespace name={name} />
      ) : name ? (
        <div className="flex gap-2 items-center">
          <div className="items-center">
            <div className="flex items-center gap-3 mb-4">
              <Avatar address={mainAccount?.address as `0x${string}`} chain={base} /> 
              <div className="flex flex-col gap-0">
                <Name address={mainAccount?.address as `0x${string}`} chain={base} />
                <Address address={mainAccount?.address as `0x${string}`} />
              </div>
            </div>
            <Button className="button-filled" onClick={handleMintNamespace} disabled={isConfirming}>
              {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Claim Namespace'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-center">
          <p className="text-xl font-light text-white">No Basename attached to this wallet</p>
          <p>Buy one at <a href="https://www.base.org/names" target="_blank" className="text-violeta">Base</a></p>
        </div>
      )}
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