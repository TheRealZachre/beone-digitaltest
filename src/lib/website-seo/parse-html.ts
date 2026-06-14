function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeEntities(match[1].trim()) : "";
}

export function extractMetaContent(html: string, key: string): string {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:name|property)=["']${key}["'][^>]+content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${key}["']`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeEntities(match[1].trim());
  }
  return "";
}

export function extractCanonical(html: string): string {
  const match = html.match(
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
  );
  return match ? decodeEntities(match[1].trim()) : "";
}

export function extractHeadings(
  html: string,
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const results: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const text = decodeEntities(match[1].replace(/<[^>]+>/g, " ").trim());
    if (text) results.push(text);
  }
  return results;
}

export function extractImages(html: string): { src: string; alt: string | null }[] {
  const regex = /<img\b[^>]*>/gi;
  const results: { src: string; alt: string | null }[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const tag = match[0];
    const srcMatch = tag.match(/\bsrc=["']([^"']+)["']/i);
    const altMatch = tag.match(/\balt=["']([^"']*)["']/i);
    if (srcMatch) {
      results.push({
        src: srcMatch[1],
        alt: altMatch ? decodeEntities(altMatch[1]) : null,
      });
    }
  }

  return results;
}

export function extractLinks(html: string): { href: string; text: string }[] {
  const regex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const results: { href: string; text: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const text = decodeEntities(match[2].replace(/<[^>]+>/g, " ").trim());
    results.push({ href: match[1], text });
  }

  return results;
}

export function extractJsonLdTypes(html: string): string[] {
  const types = new Set<string>();
  const regex =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    try {
      const json = JSON.parse(match[1]) as
        | { "@type"?: string | string[] }
        | { "@type"?: string | string[] }[];
      const records = Array.isArray(json) ? json : [json];
      for (const record of records) {
        const type = record["@type"];
        if (typeof type === "string") types.add(type);
        if (Array.isArray(type)) type.forEach((t) => types.add(t));
      }
    } catch {
      // ignore invalid JSON-LD blocks
    }
  }

  return [...types];
}

export function extractVisibleText(html: string): string {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(withoutScripts).replace(/\s+/g, " ").trim();
}

export function extractKeywordsFromText(text: string, limit = 8): string[] {
  const stopWords = new Set([
    "about", "after", "also", "been", "from", "have", "into", "more", "that",
    "their", "there", "these", "this", "with", "your", "what", "when", "where",
    "which", "while", "will", "would", "they", "them", "than", "then", "each",
    "other", "such", "only", "over", "very", "just", "like", "make", "made",
  ]);

  const counts = new Map<string, number>();
  for (const word of text.toLowerCase().match(/[a-z][a-z-]{2,}/g) ?? []) {
    if (stopWords.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}
