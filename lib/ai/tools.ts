import { z } from "zod"

import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { PEPE, USDC, erc20 } from "@goat-sdk/plugin-erc20";
import { splToken, GOAT } from "@goat-sdk/plugin-spl-token";
import { debridge } from '@goat-sdk/plugin-debridge';
import { PrivyClient } from "@privy-io/server-auth";
import { privyWallet } from "../privy/evm-client";
import { coingecko } from "@goat-sdk/plugin-coingecko";
import { resolveAddress } from "@/lib/basenames";
import { solana } from "@goat-sdk/wallet-solana";
import { Keypair } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import bs58 from "bs58";
import { pumpfun } from "@goat-sdk/plugin-pumpfun";


export const customTools = {
  askForConfirmation: {
    description: 'Ask the user for confirmation.',
    parameters: z.object({
      message: z.string().describe('The message to ask for confirmation.'),
    }),
  },
  getWeatherInformation: {
    description: 'show the weather in a given city to the user',
    parameters: z.object({ city: z.string() }),
    execute: async ({}: { city: string }) => {
      const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
      //add delay 5 seconds 
      await new Promise(resolve => setTimeout(resolve, 5000));
      return weatherOptions[
        Math.floor(Math.random() * weatherOptions.length)
      ];
    },
  },
  resolveBasename: {
    description: 'Resolve an Basename domain (format XXXX.base.eth) to an EVM address.',
    parameters: z.object({ basename: z.string() }),
    execute: async ({ basename }: { basename: string }) => {
      const resolvedAddress = await resolveAddress(basename);
      return resolvedAddress || "Address not found";
    },
  },
}

const privy = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID as string, process.env.PRIVY_SECRET as string, {
  walletApi: {
    authorizationPrivateKey: process.env.PRIVY_AUTH_KEY as string
  }
});

const userAddress = "0xD51f7Fc093290026d68178bA96a0C3D70a4730B0";
const privyWalletAdapter = privyWallet(privy, userAddress, 8453);

const goatEVM = await getOnChainTools({
  wallet: privyWalletAdapter,
  plugins: [
      erc20({ tokens: [USDC, PEPE] }),
      debridge(),
      coingecko({
        apiKey: process.env.COINGECKO_API_KEY as string,
      }),  
  ],
});

const keypair = Keypair.fromSecretKey(
  bs58.decode(process.env.SOLANA_TEST_PRIVATE_KEY as string)
);
const connection = new Connection(process.env.SOLANA_RPC_URL as string);

const goatSolana = await getOnChainTools({
  wallet: solana({keypair, connection}),  
  plugins: [
      splToken(),
      pumpfun(),
      coingecko({
        apiKey: process.env.COINGECKO_API_KEY as string,
      }),  
  ],
});


export const evmTools = { ...goatEVM };
export const solanaTools = { ...goatSolana };
