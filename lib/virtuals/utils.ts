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