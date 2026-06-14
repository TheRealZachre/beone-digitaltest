import { getWikipediaConfig } from "./config";

export interface WikipediaArticleRaw {
  pageId: number | null;
  title: string;
  exists: boolean;
  url?: string;
  lastEdited?: string;
  byteSize?: number;
  wikitext?: string;
  extract?: string;
  categories: string[];
}

function wikiApiUrl(params: Record<string, string>): string {
  const config = getWikipediaConfig();
  const search = new URLSearchParams({ ...params, format: "json" });
  return `${config.apiBase}?${search.toString()}`;
}

async function wikiFetch<T>(params: Record<string, string>): Promise<T> {
  const config = getWikipediaConfig();
  const response = await fetch(wikiApiUrl(params), {
    headers: {
      "User-Agent": config.userAgent,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Wikipedia API error (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function titleFromWikipediaInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    const match = url.pathname.match(/\/wiki\/(.+)$/);
    if (match?.[1]) {
      return decodeURIComponent(match[1].replace(/_/g, " "));
    }
  } catch {
    // not a URL — treat as page title
  }

  return trimmed;
}

export async function resolveWikipediaTitle(query: string): Promise<string | null> {
  const title = titleFromWikipediaInput(query);
  if (!title) return null;

  const data = await wikiFetch<{
    query?: { search?: { title: string }[] };
  }>({
    action: "query",
    list: "search",
    srsearch: title,
    srlimit: "1",
  });

  const hit = data.query?.search?.[0]?.title;
  return hit ?? title;
}

export async function fetchWikipediaArticle(
  query: string
): Promise<WikipediaArticleRaw> {
  const title = await resolveWikipediaTitle(query);

  if (!title) {
    return {
      pageId: null,
      title: query,
      exists: false,
      categories: [],
    };
  }

  const data = await wikiFetch<{
    query?: {
      pages?: Record<
        string,
        {
          pageid?: number;
          title?: string;
          missing?: string;
          fullurl?: string;
          extract?: string;
          categories?: { title: string }[];
          revisions?: {
            timestamp?: string;
            size?: number;
            slots?: { main?: { "*"?: string } };
          }[];
        }
      >;
    };
  }>({
    action: "query",
    titles: title,
    prop: "revisions|info|categories|extracts",
    rvslots: "main",
    rvprop: "content|timestamp|size",
    exintro: "0",
    explaintext: "1",
    cllimit: "50",
    inprop: "url",
  });

  const page = Object.values(data.query?.pages ?? {})[0];
  if (!page || page.missing !== undefined) {
    return {
      pageId: null,
      title,
      exists: false,
      categories: [],
    };
  }

  const revision = page.revisions?.[0];

  return {
    pageId: page.pageid ?? null,
    title: page.title ?? title,
    exists: true,
    url: page.fullurl,
    lastEdited: revision?.timestamp,
    byteSize: revision?.size,
    wikitext: revision?.slots?.main?.["*"],
    extract: page.extract,
    categories:
      page.categories?.map((category) =>
        category.title.replace(/^Category:/, "")
      ) ?? [],
  };
}
