import { NextResponse } from "next/server";
import { generateVideoProductionPackage } from "@/lib/video-production/generate-package";
import type { VideoProductionRequest } from "@/lib/video-production/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VideoProductionRequest;

    if (!body.topic?.trim()) {
      return NextResponse.json({ error: "Topic is required." }, { status: 400 });
    }

    const keyMessages = (body.keyMessages ?? [])
      .map((message) => message.trim())
      .filter(Boolean);

    const result = generateVideoProductionPackage({
      ...body,
      topic: body.topic.trim(),
      keyMessages,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Video production failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
