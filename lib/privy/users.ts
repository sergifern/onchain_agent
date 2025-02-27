
import { PrivyClient } from "@privy-io/server-auth";
import { NextRequest, NextResponse } from "next/server";

const privy = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID!, process.env.PRIVY_SECRET!);


export async function verifyUserAuth(req: NextRequest) {
  try {
    console.log(`Middleware triggered for: ${req.nextUrl.pathname}`);

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header missing" }, { status: 401 });
    }

    const authToken = authHeader.split(" ")[1];
    const verifiedClaims = await privy.verifyAuthToken(authToken);

    if (verifiedClaims.issuer !== "privy.io") {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    return verifiedClaims.userId; // Return userId for further use
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}