
/// echeck if user waitlist...

import { NextResponse, NextRequest } from 'next/server';
import { getPrivyUser } from '@/lib/server';
import { verifyUserAuth } from '@/lib/privy/users';


export async function GET(req: NextRequest) {

  const documents = [
    {
      id: 1,
      name: "Pizza Margherita",
      description: "A delicious pizza with a thin crust and a generous amount of cheese.",
      type: "Product",
      isPublic: true,
      views: 1234,
      likes: 89,
      access: [],
      lastUpdated: "2024-02-20T10:30:00Z",
      blockchain: {
        network: "Base",
        txHash: "0x1234567890abcdef",
        blockNumber: 1234567890,
        timestamp: "2024-02-20T10:30:00Z",
      },
      content: {
        type: "structured",
        sections: [
          {
            title: "Product Details",
            content: "Pizza Margherita is a delicious pizza with a thin crust and a generous amount of cheese.",
          },
          {
            title: "Ingredients",
            content: "Pizza Margherita is a delicious pizza with a thin crust and a generous amount of cheese.",
          },
          {
            title: "Coinbase Commerce",
            content: "https://commerce.coinbase.com/checkout/0x1234567890abcdef",
          },
        ],
      },
    },
    {
      id: "2",
      name: "Alpha Call: DOGE Season Analysis",
      type: "Alpha Call",
      isPublic: true,
      views: 1234,
      likes: 89,
      access: [],
      lastUpdated: "2024-02-20T10:30:00Z",
      blockchain: {
        network: "Base",
        txHash: "0x1234567890abcdef",
        blockNumber: 1234567890,
        timestamp: "2024-02-20T10:30:00Z",
      },
      content: {
        type: "structured",
        sections: [
          {
            title: "Market Overview",
            content: "DOGE has shown significant momentum in the past week, with increasing volume and social metrics...",
          },
          {
            title: "Technical Analysis",
            content:
              "Key resistance levels have been broken at $0.12 and $0.15. The next major resistance lies at $0.20...",
          },
          {
            title: "Catalysts",
            content: "1. Potential X integration\n2. DeFi developments\n3. Layer 2 solutions",
          },
          {
            title: "Risk Factors",
            content: "- Market volatility\n- Regulatory uncertainties\n- Dependency on key figures",
          },
        ],
      },
    },
    {
      id: 3,
      name: "DoorDash Delivery Address",
      type: "note",
      isPublic: false,
      views: 1234,
      likes: 89,  
      access: [],
      lastUpdated: "2024-02-18T08:20:00Z",
      blockchain: {
        network: "Base",
        txHash: "0x1234567890abcdef",
        blockNumber: 1234567890,
        timestamp: "2024-02-20T10:30:00Z",
      },
      content: {
        type: "structured",
        sections: [
          {
            title: "DoorDash Delivery Address",
            content: "1234 Main St, Anytown, USA",
          },
        ],
      },
    },
  ]


  return NextResponse.json({ documents }, { status: 200 });

}
