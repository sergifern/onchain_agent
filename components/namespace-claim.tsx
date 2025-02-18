import { getAccessToken, usePrivy, useWallets } from "@privy-io/react-auth";
import { useName } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";
import { Button } from "./ui/button";
import { BadgeCheck } from "lucide-react";
import { usePrivyLogin } from "@/hooks/privy-hooks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import {useSetActiveWallet} from '@privy-io/wagmi';
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";


export default function NamespaceClaim() {
  const { user, authenticated } = usePrivy();
  const {wallets, ready} = useWallets();
  const { setActiveWallet } = useSetActiveWallet();

  const { login } = usePrivyLogin();
  const { sendTransaction, data: hash } = useSendTransaction();
  console.log('hash', hash);
  const [isMinted, setIsMinted] = useState<boolean | null>(null);
  const [loadingMintCheck, setLoadingMintCheck] = useState(true);
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash,
  })

  const mainAccount = user?.linkedAccounts.find(
    (acc) => acc.type === "wallet" && acc.connectorType !== "embedded"
  );

  const injectedWallet = wallets.find((wallet) => wallet.walletClientType !== 'privy');
  console.log('injectedWallet', injectedWallet?.address);


  const { data: name, isLoading: nameIsLoading } = useName({ address: injectedWallet?.address as `0x${string}`, chain: base });

  // Verificar si el namespace ya está mintado
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
  


  useEffect(() => {
    const updateNamespaceStatus = async () => {
      if (isConfirmed && injectedWallet?.address) {
        try {
          const accessToken = await getAccessToken(); // Get access token
          const response = await fetch("/api/users/namespace", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ address: injectedWallet.address, minted: true }),
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
  }, [isConfirmed]);
  

  const handleMintNamespace = async () => {
    if (!injectedWallet?.address) return;
    await setActiveWallet(injectedWallet);

    try {
      const tx = sendTransaction({
        to: "0x0000000000000000000000000000000000000000", // Dirección del contrato de mint
        value: parseEther("0.0001"),
        chainId: base.id,
      });

      console.log("Mint transaction sent:", tx);
      
      setTimeout(() => {
        setIsMinted(true); // Simulamos que se ha mintado tras enviar la tx
      }, 5000);
      
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
    return <p>Checking namespace status...</p>;
  }

  return (
    <div className="flex gap-2 items-center">
      {isMinted ? (
        <>
          <p className="text-xl font-semibold">{name}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <BadgeCheck className="w-5 h-5 text-emerald-500" />
              </TooltipTrigger>
              <TooltipContent className="border-0 bg-background">
                <p>Namespace claimed</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      ) : (
        <Button variant="default" onClick={handleMintNamespace}>
          Mint Namespace
        </Button>
      )}
    </div>
  );
}
