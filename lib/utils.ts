import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// function that from eth addres returns the first 6 and last 4 characters
export function truncateAddress(address: string | undefined) {
  if (!address) return ""
  return address.slice(0, 6) + "..." + address.slice(-4)
}


// transform ethy token amount to human readable format, with two decimals, and if more than 1million show in millions 1m
export function formatEthyAmount(amount: number) {
  if (amount === 0) return "0"
  console.log(amount)
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(2) + "m"
  }
  return amount.toFixed(2)
}




// fake request with timeout and response true or false
export function fakeRequest() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

export function detectBlockchain(lastMessage: string): "solana" | "evm" | "unknown" {
  const text = lastMessage.toLowerCase();

  if (text.includes("solana") || text.includes("spl token") || text.includes("pumpfun")) return "solana";
  if (text.includes("evm") || text.includes("ethereum") || text.includes("erc20")) return "evm";

  return "unknown";
}
