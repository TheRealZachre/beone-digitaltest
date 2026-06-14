import type { MediaMonitorSearchResponse } from "./types";

export function formatMediaMonitorForExport(
  result: MediaMonitorSearchResponse
): string {
  const lines = [
    `Media Monitor — ${result.subject}`,
    `Searched: ${new Date(result.searchedAt).toLocaleString()}`,
    `News: ${result.newsCount} · Social: ${result.socialCount}`,
    `Sources: ${result.sourcesUsed.join(", ")}`,
    "",
    "NEWS ARTICLES",
    ...result.news.map(
      (article, index) =>
        `${index + 1}. ${article.title}\n   ${article.source} · ${new Date(article.publishedAt).toLocaleDateString()}\n   ${article.url}\n   ${article.snippet}`
    ),
    "",
    "SOCIAL POSTS",
    ...result.socialPosts.map(
      (post, index) =>
        `${index + 1}. [${post.platform}] ${post.author}${post.authorHandle ? ` (${post.authorHandle})` : ""}\n   ${new Date(post.publishedAt).toLocaleDateString()} · ${post.engagement.likes} likes · ${post.engagement.shares} shares\n   ${post.text.slice(0, 280)}${post.text.length > 280 ? "…" : ""}\n   ${post.url}`
    ),
  ];

  return lines.join("\n");
}
