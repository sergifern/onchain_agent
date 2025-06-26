'use client'

import React, { useState, useEffect } from 'react'
import Mentions from 'rc-mentions'
import './style.css'
import { ASSETS } from '@/lib/assets/assets'

const { Option } = Mentions

// Utility function to shorten address
const shortenAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

interface Token {
  address: string
  name: string
}

interface TokenMentionsProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

export default function TokenMentions({ 
  value = '', 
  onChange, 
  placeholder = "Type something like $ETH or $BTC...",
  className,
  style
}: TokenMentionsProps) {
  const [tokens, setTokens] = useState<Token[]>([])

  useEffect(() => {
    // Initialize tokens sorted alphabetically
    const initialTokens = ASSETS.map((token) => ({
      address: token.address,
      name: token.symbol,
    })).sort((a, b) => a.name.localeCompare(b.name))
    
    setTokens(initialTokens)
  }, [])

  const handleChange = (val: string) => {
    onChange?.(val)
  }

  const handleSearch = (text: string, prefix: string) => {
    if (prefix === '$') {
      const allTokens = ASSETS.map((token) => ({
        address: token.address,
        name: token.symbol,
      })).sort((a, b) => a.name.localeCompare(b.name))
      
      if (!text || text.trim() === '') {
        setTokens(allTokens)
      } else {
        const filtered = allTokens.filter((token) =>
          token.name.toLowerCase().includes(text.toLowerCase())
        )
        setTokens(filtered)
      }
    }
  }

  return (
    <Mentions
      value={value}
      onChange={handleChange}
      onSearch={handleSearch}
      prefix="$"
      placeholder={placeholder}
      autoSize
      className={className}
      style={{ minHeight: 120, ...style }}
    >
      {tokens.map((token) => (
        <Option key={token.address} value={token.name}>
          <div
            className="list--hover"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span>{token.name}</span>
            <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.85em' }}>
              {shortenAddress(token.address)}
            </span>
          </div>
        </Option>
      ))}
    </Mentions>
  )
}
