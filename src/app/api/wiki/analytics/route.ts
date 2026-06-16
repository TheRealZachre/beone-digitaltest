import { type NextRequest, NextResponse } from "next/server";

const WIKI_BACKEND = process.env.WIKI_BACKEND_URL ?? "http://127.0.0.1:8000";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const upstream = new URL(`${WIKI_BACKEND}/api/analytics`);
  searchParams.forEach((v, k) => upstream.searchParams.set(k, v));

  try {
    const res = await fetch(upstream.toString(), { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the Wikipedia analytics backend. Make sure it is running on port 8000." },
      { status: 502 }
    );
  }
}
