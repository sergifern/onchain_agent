import { NextResponse } from "next/server";
import { getTotalCreditsByUserId } from "@/lib/mongodb/credits";
import { verifyUserAuth } from "@/lib/privy/users";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get the user ID from the request
    const authResult = await verifyUserAuth(req);

    // If authResult is a NextResponse (error), return it directly
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // authResult is the userId string
    const userId = authResult;

    // Get total credits for the user
    const totalCredits = await getTotalCreditsByUserId(userId);

    return NextResponse.json({ 
      success: true,
      totalCredits: totalCredits || 0
    });

  } catch (error) {
    console.error("Error fetching user credits:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
} 