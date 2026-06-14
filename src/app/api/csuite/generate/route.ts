import { extractCorporateThemes } from "@/lib/csuite/extract-themes";
import { generateExecutiveContent } from "@/lib/csuite/generate-content";
import { getLinkedInPosts } from "@/lib/data";
import type { GenerateContentRequest } from "@/lib/csuite/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateContentRequest;

    if (!body.executiveId?.trim()) {
      return Response.json({ error: "executiveId is required." }, { status: 400 });
    }

    const { posts } = await getLinkedInPosts();
    const themes = extractCorporateThemes(posts);

    const theme = body.themeId
      ? themes.find((t) => t.id === body.themeId)
      : themes[0];

    if (!theme) {
      return Response.json(
        { error: "No corporate themes found to generate from." },
        { status: 400 }
      );
    }

    const result = generateExecutiveContent(
      body.executiveId,
      theme,
      body.voiceOverrides
    );

    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate content.";
    return Response.json({ error: message }, { status: 500 });
  }
}
