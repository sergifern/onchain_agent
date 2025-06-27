import { ethers } from "ethers";

// ABI amb les dues funcions que necessitem
const stakingAbi = [
  {
    name: 'stakedAmountOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }]
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }]
  }
]



export async function getStakedBalance(contract: string, address: string) {

  //console.log(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL);
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL);

  const stakingContract = new ethers.Contract(contract, stakingAbi, provider);
  const balance = await stakingContract.stakedAmountOf(address);

  return Number(ethers.formatEther(balance));

}


import { getAssetBySymbol } from "../assets/utils";
import { virtualsAgents } from "../virtuals/agents";

export const getStakingContractAddress = (assetSymbol: string) => {
  const asset = getAssetBySymbol(assetSymbol);
  if (!asset) {
    return null;
  }

  const stakingContract = virtualsAgents.find(agent => agent.tokenAddress === asset.address);
  if (!stakingContract) {
    return null;
  }

  return stakingContract.agentStakingContract;
}