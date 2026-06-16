import { type NextRequest, NextResponse } from "next/server";
import { fetchArticle, fetchPageviews, summarise } from "@/lib/wikipedia/fetch";

export const runtime = "nodejs";

function isoToday() {
  return new Date().toISOString().split("T")[0];
}
function isoDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing ?q= parameter." }, { status: 400 });
  }

  const startDate = searchParams.get("start_date") ?? isoDaysAgo(89);
  const endDate = searchParams.get("end_date") ?? isoToday();

  try {
    const article = await fetchArticle(q);
    if (!article) {
      return NextResponse.json(
        { error: `No article found for "${q}".` },
        { status: 404 }
      );
    }

    const pageviews = await fetchPageviews(
      article.title,
      article.project,
      startDate,
      endDate
    );
    const metrics = summarise(article, pageviews);

    return NextResponse.json({
      title: article.title,
      project: article.project,
      url: article.url,
      metrics,
      pageviews,
      maintenance_flags: article.maintenanceFlags,
      _extract: article.extract,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: String(e) },
      { status: 500 }
    );
  }
}
