import { NextResponse } from "next/server";
import { trainVoiceProfile } from "@/lib/voice-training/analyze";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { executiveId?: string };

    if (!body.executiveId?.trim()) {
      return NextResponse.json(
        { error: "executiveId is required." },
        { status: 400 }
      );
    }

    const profile = trainVoiceProfile(body.executiveId.trim());
    return NextResponse.json(profile);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Voice training failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
