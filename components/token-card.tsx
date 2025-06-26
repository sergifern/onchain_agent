import Image from "next/image"
import { Copy } from "lucide-react"
import { useState } from "react"

interface TokenCardProps {
  token_address: string
  name: string
  symbol: string
  imageUrl?: string
  price: string
  fdv?: number
  balance: string
  decimals: number
  balanceInUsd: number
}

export default function TokenCard({
  token_address,
  name,
  symbol,
  imageUrl,
  price,
  fdv,
  balance,
  decimals,
  balanceInUsd
}: TokenCardProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const formatBalance = (balance: string, decimals: number) => {
    const numBalance = parseFloat(balance) / Math.pow(10, decimals)
    return numBalance.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString(undefined, {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    })
  }

  return (
    <div className="rounded-xl p-4 transition-shadow border border-secondary/80 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-lg">
                {symbol.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-gray-500">{symbol}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-400">
                {formatAddress(token_address)}
              </p>
              <button
                onClick={() => copyToClipboard(token_address)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Copy className="h-3 w-3" />
              </button>
              {copiedAddress === token_address && (
                <span className="text-xs text-emerald-800">Copied!</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-secondary">
            ${formatPrice(price)}
          </div>
          {fdv && (
            <div className="text-xs text-secondary">
              FDV: ${fdv.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2 pb-2">
        <div className="space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-secondary">Value</span>
            <span className="text-lg font-semibold ">
              ${balanceInUsd.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-secondary">Balance</span>
            <span className="text-sm text-muted-foreground">
              {formatBalance(balance, decimals)} {symbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 