import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";

export async function getPrivyUser(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return null;
  }
  const idToken = req.cookies.get('privy-id-token');
  if (!idToken?.value) {
    return null;
  }
  const privy = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID!, process.env.PRIVY_SECRET!);
  const user = await privy.getUser({idToken: idToken.value})
  return user;
}