const FETCH_TIMEOUT_MS = 20_000;

export interface PageFetchResult {
  url: string;
  finalUrl: string;
  status: number;
  html: string;
  responseTimeMs: number;
  contentType: string;
}

export async function fetchPage(url: string): Promise<PageFetchResult> {
  const start = Date.now();
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "VibeCodeFlow-SEO-Audit/1.0 (+https://vibe.code; website audit bot)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  const html = await response.text();

  return {
    url,
    finalUrl: response.url,
    status: response.status,
    html,
    responseTimeMs: Date.now() - start,
    contentType: response.headers.get("content-type") ?? "",
  };
}

export async function fetchTextResource(
  baseUrl: string,
  path: string
): Promise<{ found: boolean; content: string; status: number }> {
  try {
    const url = new URL(path, baseUrl).toString();
    const response = await fetch(url, {
      headers: { "User-Agent": "VibeCodeFlow-SEO-Audit/1.0" },
      signal: AbortSignal.timeout(10_000),
    });
    const content = response.ok ? await response.text() : "";
    return { found: response.ok, content, status: response.status };
  } catch {
    return { found: false, content: "", status: 0 };
  }
}

export function normalizeAuditUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("URL is required.");

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  const parsed = new URL(withProtocol);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  return parsed.toString();
}

export function isInternalLink(href: string, origin: string): boolean {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  try {
    const resolved = new URL(href, origin);
    return resolved.origin === new URL(origin).origin;
  } catch {
    return false;
  }
}

export async function checkLinkStatus(
  href: string,
  origin: string
): Promise<{ href: string; status: number | "error" }> {
  try {
    const resolved = new URL(href, origin).toString();
    const response = await fetch(resolved, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": "VibeCodeFlow-SEO-Audit/1.0" },
      signal: AbortSignal.timeout(8_000),
    });
    return { href: resolved, status: response.status };
  } catch {
    return { href, status: "error" };
  }
}
