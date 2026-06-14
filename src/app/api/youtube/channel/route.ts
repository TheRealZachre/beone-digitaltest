import { fetchChannelAnalysis } from "@/lib/youtube/sync";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { channelUrl?: string };
    const channelUrl = body.channelUrl?.trim();

    if (!channelUrl) {
      return Response.json(
        { error: "channelUrl is required." },
        { status: 400 }
      );
    }

    const result = await fetchChannelAnalysis(channelUrl);
    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to analyze channel.";
    return Response.json({ error: message }, { status: 500 });
  }
}
