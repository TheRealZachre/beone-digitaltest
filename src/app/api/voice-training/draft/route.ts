import { NextResponse } from "next/server";
import { draftInExecutiveVoice } from "@/lib/voice-training/draft";
import type { VoiceDraftRequest } from "@/lib/voice-training/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VoiceDraftRequest;

    if (!body.executiveId?.trim() || !body.topic?.trim()) {
      return NextResponse.json(
        { error: "executiveId and topic are required." },
        { status: 400 }
      );
    }

    const draft = draftInExecutiveVoice({
      ...body,
      executiveId: body.executiveId.trim(),
      topic: body.topic.trim(),
    });

    return NextResponse.json(draft);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Voice draft failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
