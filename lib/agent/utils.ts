import { usePrivy } from "@privy-io/react-auth";
import { useWallets, WalletWithMetadata } from "@privy-io/react-auth";

export function useEmbeddedWallet() {
  const { ready, wallets } = useWallets();
  
  if (!ready) {
    return { wallet: null, ready: false };
  }

  const evmWallet = wallets.find((wallet) => wallet.walletClientType === 'privy' && wallet.connectorType === 'embedded' && wallet.type === 'ethereum');
  return { wallet: evmWallet, ready: true };
}

// Utility function to get embedded wallet address
export function useEmbeddedWalletAddress() {
  const { wallet, ready } = useEmbeddedWallet();
  return { address: wallet?.address, ready };
}

// Utility function to check if embedded wallet is connected
export function useEmbeddedWalletStatus() {
  const { wallet, ready } = useEmbeddedWallet();
  return { 
    isConnected: !!wallet?.address, 
    ready,
    walletType: wallet?.walletClientType,
    chainId: wallet?.chainId
  };
}

export function useEmbeddedWalletDelegated() {
  const { wallet, ready } = useEmbeddedWallet();
  const { user } = usePrivy();
  const isAlreadyDelegated = !!user?.linkedAccounts.find(
    (account): account is WalletWithMetadata => account.type === 'wallet' && account.address === wallet?.address && account.delegated,
  );
  return { wallet, isAlreadyDelegated, ready };
}