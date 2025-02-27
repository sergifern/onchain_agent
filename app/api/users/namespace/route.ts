import { NextResponse, NextRequest } from 'next/server';
import { verifyUserAuth } from '@/lib/privy/users';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyUserAuth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const address = req.nextUrl.searchParams.get('address');
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    //const namespace = await getNamespace(address);

    return NextResponse.json({ success: true, minted: false, name: 'builder00.base.eth' }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyUserAuth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log(user);


    return NextResponse.json({ success: true, message: 'success' }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
