import { NextResponse } from "next/server";
import { searchMediaMonitor } from "@/lib/media-monitor/search";
import type { MediaMonitorSearchRequest } from "@/lib/media-monitor/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MediaMonitorSearchRequest;

    if (!body.subject?.trim()) {
      return NextResponse.json(
        { error: "Subject is required." },
        { status: 400 }
      );
    }

    const result = await searchMediaMonitor(body);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Media monitor search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
