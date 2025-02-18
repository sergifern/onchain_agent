

import { NextResponse, NextRequest } from 'next/server';
import { getPrivyUser } from '@/lib/server';

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
