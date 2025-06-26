import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { ExternalAddress } from '@coinbase/coinbase-sdk';
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  try {
    const address = "0x1f294306d01546a4cd5E62F3c165c5B7B31C7F83";
    let externalAddress = new ExternalAddress("base", address as `0x${string}` ); 

    //console.log(externalAddress);
  // Fetch reputation metadata for the address as JSON including score, reputation metadata, and risk metadata
  const addressReputation = await externalAddress.reputation();
  //console.log(addressReputation);
  // addressReputation.risky returns 0 if no risk indicated, or 1 if risk indicated
  if(addressReputation.risky) {
      // actions if risk indicated
  }

  // addressReputation.metadata returns a JSON summarizing the address's transaction history

  // addressReputation.score returns the numerical score between -100 and +100
  if(addressReputation.score > 50) {
      // actions based on reputation score
  }

    return NextResponse.json(addressReputation, { status: 200 });
  } catch (error) {
    //console.error("Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

