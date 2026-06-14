import { buildMonthlyReport, buildQuarterlyReport } from "@/lib/csuite/reports";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") ?? "monthly";

    if (timeframe === "quarterly") {
      return Response.json(buildQuarterlyReport());
    }

    return Response.json(buildMonthlyReport());
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to build report.";
    return Response.json({ error: message }, { status: 500 });
  }
}
