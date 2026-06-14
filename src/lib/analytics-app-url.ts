/** Base URL for the analytics-only app (separate deployment). */
export function getAnalyticsAppUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_ANALYTICS_URL ??
    process.env.ANALYTICS_APP_URL ??
    process.env.NEXT_PUBLIC_ANALYTICS_APP_URL;

  if (raw) return raw.replace(/\/$/, "");

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3001";
  }

  return "https://analytics-demo-beone.zach-a56.workers.dev";
}

export function analyticsHref(path: string, baseUrl?: string): string {
  const root = baseUrl ?? getAnalyticsAppUrl();
  if (path === "/") return root;
  return `${root}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isExternalAnalyticsUrl(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}
