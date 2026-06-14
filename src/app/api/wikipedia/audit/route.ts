import { NextResponse } from "next/server";
import { auditWikipediaPages } from "@/lib/wikipedia/analyze";
import type { WikipediaAuditRequest } from "@/lib/wikipedia/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as WikipediaAuditRequest;

    const result = await auditWikipediaPages(body);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Wikipedia audit failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
