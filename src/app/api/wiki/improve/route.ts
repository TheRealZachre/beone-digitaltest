import { type NextRequest, NextResponse } from "next/server";

const WIKI_BACKEND = process.env.WIKI_BACKEND_URL ?? "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${WIKI_BACKEND}/api/improve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the Wikipedia analytics backend. Make sure it is running on port 8000." },
      { status: 502 }
    );
  }
}
