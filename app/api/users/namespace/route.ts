import { NextResponse, NextRequest } from 'next/server';
import { verifyUserAuth } from '@/lib/privy/users';
import { supabase } from '@/supabaseClient';

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

    const { data: namespaces, error: namespaceError } = await supabase
      .from("namespaces")
      .select("*")
      .eq("user", address);

    if (namespaceError) return NextResponse.json({ error: namespaceError.message }, { status: 500 });
    
    if (namespaces.length > 0) {
      return NextResponse.json({ success: true, claimed: true, name: namespaces[0].basename }, { status: 200 });
    } else {
      return NextResponse.json({ success: true, claimed: false, name: 'No namespace found' }, { status: 200 });
    }
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

    
    // save on namesapce table, user, basename
    //come from body: JSON.stringify({ address: mainAccount.address, claimed: true, name: name }),
    const body = await req.json();
    const { address, claimed, name } = body;

    
    const { data: namespaces, error: namespaceError } = await supabase
      .from("namespaces")
      .insert({ user: address, basename: name });

    if (namespaceError) return NextResponse.json({ error: namespaceError.message }, { status: 500 });

    return NextResponse.json({ success: true, message: 'success' }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
