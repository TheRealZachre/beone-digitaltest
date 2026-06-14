import { runWebsiteAudit } from "@/lib/website-seo/audit";
import type { WebsiteAuditRequest } from "@/lib/website-seo/types";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WebsiteAuditRequest;
    const url = body.url?.trim();

    if (!url) {
      return Response.json({ error: "url is required." }, { status: 400 });
    }

    const result = await runWebsiteAudit({
      url,
      competitorUrl: body.competitorUrl?.trim() || undefined,
    });

    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to run website audit.";
    return Response.json({ error: message }, { status: 500 });
  }
}
