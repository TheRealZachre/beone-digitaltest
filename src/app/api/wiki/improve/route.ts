import { type NextRequest, NextResponse } from "next/server";
import { analyseArticle } from "@/lib/wikipedia/review";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const report = await analyseArticle(
      body.title ?? "",
      body.extract ?? "",
      body.metrics ?? {},
      body.maintenance_flags ?? []
    );
    return NextResponse.json(report);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e), issues: [] });
  }
}
