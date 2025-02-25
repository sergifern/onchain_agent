
/// echeck if user waitlist...

import { NextResponse, NextRequest } from 'next/server';
import { getPrivyUser } from '@/lib/server';
import { verifyUserAuth } from '@/lib/privy/users';

// get rthat returns true if user is on waitlist

export async function GET(req: NextRequest) {
  try {
    const user = await verifyUserAuth(req)
    console.log(user);


    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ status: true }, { status: 200 });

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
