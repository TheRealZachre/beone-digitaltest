import { NextResponse } from "next/server";
import { scanReputation } from "@/lib/reputation/analyze";
import type { ReputationScanRequest } from "@/lib/reputation/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as ReputationScanRequest;
    const result = await scanReputation(body);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Reputation scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
