export interface ParsedRssItem {
  title: string;
  link: string;
  publishedAt: string;
  snippet: string;
  source: string;
}

function decodeEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block: string, tag: string): string {
  const match = block.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
  );
  return match ? decodeEntities(match[1]) : "";
}

function publisherFromTitle(title: string): string {
  const dashSplit = title.split(" - ");
  if (dashSplit.length > 1) {
    return dashSplit[dashSplit.length - 1].trim();
  }
  return "News";
}

export function parseRssFeed(xml: string): ParsedRssItem[] {
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];

  return blocks
    .map((block) => {
      const title = extractTag(block, "title");
      const link = extractTag(block, "link");
      const publishedAt =
        extractTag(block, "pubDate") || extractTag(block, "published");
      const snippet =
        extractTag(block, "description") || extractTag(block, "summary");
      const source = extractTag(block, "source") || publisherFromTitle(title);

      if (!title || !link) return null;

      return {
        title,
        link,
        publishedAt: publishedAt
          ? new Date(publishedAt).toISOString()
          : new Date().toISOString(),
        snippet,
        source,
      };
    })
    .filter((item): item is ParsedRssItem => item !== null);
}

export function normalizeNewsTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
}
