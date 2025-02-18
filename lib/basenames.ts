
import {
  Address,
  ContractFunctionParameters,
  createPublicClient,
  encodePacked,
  http,
  isAddress,
  keccak256,
  namehash,
} from 'viem';
import { base, mainnet } from 'viem/chains';
import L2ResolverAbi from '@/lib/abis/L2ResolverAbi'

const baseClient = createPublicClient({
  chain: base,
  transport: http(process.env.RPC_PROVIDER_URL as string),
});

export async function getBasename(address: Address) {
  try {
    const addressReverseNode = convertReverseNodeToBytes(address, base.id);
    const basename = await baseClient.readContract({
      abi: L2ResolverAbi,
      address: '0xc6d566a56a1aff6508b41f6c90ff131615583bcd',
      functionName: 'name',
      args: [addressReverseNode],
    });

    console.log("*************basename", basename);
    if (basename) {
      return basename;
    }
  } catch (error) {
    console.error('Error resolving Basename:', error);
  }
}

export const convertReverseNodeToBytes = (
  address: Address,
  chainId: number,
) => {
  const addressFormatted = address.toLocaleLowerCase() as Address;
  const addressNode = keccak256(addressFormatted.substring(2) as Address);
  const chainCoinType = convertChainIdToCoinType(chainId);
  const baseReverseNode = namehash(
    `${chainCoinType.toLocaleUpperCase()}.reverse`,
  );
  const addressReverseNode = keccak256(
    encodePacked(['bytes32', 'bytes32'], [baseReverseNode, addressNode]),
  );
  return addressReverseNode;
};

export const convertChainIdToCoinType = (chainId: number): string => {
  if (chainId === mainnet.id) {
    return 'addr';
  }
  const cointype = (0x80000000 | chainId) >>> 0;
  return cointype.toString(16).toLocaleUpperCase();
};

export async function fetchEnsAddress(name: string) {  
  const client = createPublicClient({
    chain: { ... base, contracts: { ... base.contracts, ensUniversalResolver: { address: '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD', blockCreated: 19_258_213, }, }, },
    transport: http(process.env.RPC_PROVIDER_URL as string),
  })
  const address = await client.getEnsAddress({
    name,
  });
  return address;
}

export async function resolveAddress(address: string) {
  if (isAddress(address)) {
    return address;
  } else {
    return await fetchEnsAddress(address);
  }
}