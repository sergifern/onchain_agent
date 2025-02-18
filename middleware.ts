import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';

export async function middleware(req: NextRequest) {

  const privy = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID!, process.env.PRIVY_SECRET!);
  console.log(`Middleware triggered for: ${req.nextUrl.pathname}`);

  if (!req.nextUrl.pathname.startsWith('/api/users')) {
    console.log("Not a user api call");
    return NextResponse.next();
  }
  const authHeader = req.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
  }


  try {
    const authToken = authHeader.split(" ")[1];

    const verifiedClaims = await privy.verifyAuthToken(authToken);
    if (verifiedClaims.issuer !== 'privy.io') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }
    const userId = verifiedClaims.userId;
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    console.error("Middleware - Error verifying token:", error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }
}

export const config = {
  matcher: ['/api/users/:path*'],
};
