
import { NextResponse } from "next/server";


export async function POST(req: Request) {



  return NextResponse.json({ message: 'Running on Node.js' }, { status: 200 });

}

