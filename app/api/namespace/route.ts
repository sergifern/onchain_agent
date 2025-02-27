
/// echeck if user waitlist...

import { NextResponse, NextRequest } from 'next/server';
import { getPrivyUser } from '@/lib/server';
import { verifyUserAuth } from '@/lib/privy/users';

// get rthat returns true if user is on waitlist

export async function GET(req: NextRequest) {
  try {

    const namespaces = [
      {
        id: 1,
        name: "jesse.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x4bEf0221d6F7Dd0C969fe46a4e9b339a84F52FDF",
        documents: 12,
        claimed: true,
        github: "jessedoe",
        twitter: "@jessecrypto",
      },
      {
        id: 2,
        name: "pizzahouse.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1f294306d01546a4cd5E62F3c165c5B7B31C7F83",
        documents: 5,
        claimed: true,
        github: "alphatrader",
        twitter: "@alphacalls",
      },
      {
        id: 3,
        name: "degen.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x4567...8901",
        documents: 8,
        claimed: false,
        github: "degenlabs",
        twitter: "@degenlabs",
      },
      {
        id: 4,
        name: "builder00.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1234...5678",
        documents: 12,
        claimed: true,
      },
      {
        id: 5,
        name: "agentXBT.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1234...5678",
        documents: 12,
        claimed: true,
      },
      {
        id: 6,
        name: "pizzahouse.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1234...5678",
        documents: 12,
        claimed: true,
      },
      {
        id: 7,
        name: "builder01.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1234...5678",
        documents: 12,
        claimed: true,
      },
      {
        id: 8,
        name: "builder02.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1234...5678",
        documents: 12,
        claimed: true,
      },
      {
        id: 9,
        name: "builder03.base.eth",
        avatar: "/placeholder.svg?height=100&width=100",
        address: "0x1234...5678",
        documents: 12,
        claimed: true,
      }
    ]
    

    return NextResponse.json({ namespaces }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getPrivyUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log(user);


    return NextResponse.json({ message: 'success' }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
