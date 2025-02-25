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

export function truncateHash(hash: string | undefined) {
  if (!hash) return ""
  return hash.slice(0, 10) + "..." + hash.slice(-10)
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

export function detectBlockchain(messages: Message[]): "solana" | "evm" | "unknown" {
  for (let i = messages.length - 1; i >= 0; i--) { // Recorrer desde el último mensaje hacia atrás
    const text = messages[i].content.toLowerCase();

    if (text.includes("evm") || text.includes("ethereum") || text.includes("erc20") || text.includes("base") || text.includes("debridge")) return "evm";
    if (text.includes("solana") || text.includes("spl token") || text.includes("pumpfun")) return "solana";
  }

  return "unknown"; // Si no se encuentra ninguna coincidencia
}
