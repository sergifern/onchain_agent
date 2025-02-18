import { NextResponse, NextRequest } from 'next/server';
import { getPrivyUser } from '@/lib/server';


export async function GET(req: NextRequest) {
  try {
    const user = await getPrivyUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const address = req.nextUrl.searchParams.get('address');
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    //const namespace = await getNamespace(address);

    return NextResponse.json({ success: true }, { status: 200 });
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


    return NextResponse.json({ success: true, message: 'success' }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
