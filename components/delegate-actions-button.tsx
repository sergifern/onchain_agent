import {
  usePrivy,
  useSolanaWallets,
  useDelegatedActions,
  type WalletWithMetadata,
  useWallets,
} from '@privy-io/react-auth';
import { Button } from './ui/button';
import { Account } from 'viem';

export function DelegateActionButton({account}: {account: Account}) {
  const {user} = usePrivy();
  const {ready, wallets} = useWallets(); // or useWallets()
  const {delegateWallet, revokeWallets} = useDelegatedActions();

  // Find the embedded wallet to delegate from the array of the user's wallets
  const walletToDelegate = wallets.find((wallet) => wallet.address === account.address && wallet.walletClientType === 'privy');
  //console.log('walletToDelegate', walletToDelegate)

  // Check if the wallet to delegate by inspecting the user's linked accounts
  const isAlreadyDelegated = !!user?.linkedAccounts.find(
    (account): account is WalletWithMetadata => account.type === 'wallet' && account.address === account.address && account.delegated,
  );
  //console.log('isAlreadyDelegated', isAlreadyDelegated)


  const onDelegate = async () => {
    if (!walletToDelegate || !ready) return; // Button is disabled to prevent this case
    await delegateWallet({address: walletToDelegate.address, chainType: walletToDelegate.type}); // or chainType: 'ethereum'
  };
  const onRevoke = async () => {
    await revokeWallets();
  };

  if (!ready || !walletToDelegate || isAlreadyDelegated) {
    return (
      <Button disabled={!ready || !isAlreadyDelegated} onClick={onRevoke}>
        Revoke access
      </Button>
    );
  }
  return (
    <Button disabled={!ready || !walletToDelegate || isAlreadyDelegated} onClick={onDelegate}>
      Delegate access
    </Button>
  );
}