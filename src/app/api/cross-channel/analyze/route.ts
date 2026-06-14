import { NextResponse } from "next/server";
import { analyzeCrossChannel } from "@/lib/cross-channel/analyze";
import type { CrossChannelAnalyzeRequest } from "@/lib/cross-channel/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as CrossChannelAnalyzeRequest;
    const result = await analyzeCrossChannel(body);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Cross-channel analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
