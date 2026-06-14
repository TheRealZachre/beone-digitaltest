import { extractCorporateThemes } from "@/lib/csuite/extract-themes";
import { getLinkedInPosts } from "@/lib/data";

export async function GET() {
  try {
    const { posts, source, meta } = await getLinkedInPosts();
    const themes = extractCorporateThemes(posts);

    return Response.json({
      themes,
      postCount: posts.length,
      source,
      syncedAt: meta?.syncedAt ?? null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to extract themes.";
    return Response.json({ error: message }, { status: 500 });
  }
}
