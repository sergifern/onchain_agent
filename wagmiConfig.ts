import { base } from 'viem/chains';
import { createConfig } from '@privy-io/wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { http, cookieStorage, createStorage } from 'wagmi';

export const config = createConfig({
  chains: [base],
  /*connectors: [
    coinbaseWallet({
      appName: 'OnchainKit',
      preference: 'smartWalletOnly',
      version: '4',
    }),
  ],*/
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [base.id]: http('https://api.developer.coinbase.com/rpc/v1/base/8pJx6sdpI5CGaC0mFfjTeQnQTTuItnzb'),
  },
  ssr: true,
})
