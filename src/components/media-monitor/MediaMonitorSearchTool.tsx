"use client";

import { useState } from "react";
import { Loader2, Radar, Search } from "lucide-react";
import { getMediaMonitorConfig } from "@/lib/media-monitor/config";
import type { MediaMonitorSearchResponse } from "@/lib/media-monitor/types";
import { MediaMonitorResults } from "./MediaMonitorResults";

const defaults = getMediaMonitorConfig();

export function MediaMonitorSearchTool() {
  const [subject, setSubject] = useState(defaults.defaultSubject);
  const [includeCached, setIncludeCached] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MediaMonitorSearchResponse | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/media-monitor/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          includeCachedSocial: includeCached,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Search failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <MediaMonitorResults
        result={result}
        onReset={() => {
          setResult(null);
          setError(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
            <Radar className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">
              Search news & social for a subject
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter a company, executive, product name, or topic to aggregate
              recent coverage.
            </p>
          </div>
        </div>

        <label className="mt-6 block text-sm font-medium text-slate-700">
          Subject
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="BeOne Medicines, John V. Oyler, sonrotoclax…"
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            required
          />
        </label>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={includeCached}
            onChange={(event) => setIncludeCached(event.target.checked)}
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          Include major posts from synced social channels (ranked by engagement)
        </label>

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          {loading ? "Pulling articles & posts…" : "Search media"}
        </button>
      </form>

      <p className="text-xs text-slate-400">
        News from Google News and Bing News RSS. Optional: set NEWS_API_KEY for
        NewsAPI and sync credentials for live X search. Synced channel posts require
        Pull Latest Data on the analytics dashboard.
      </p>
    </div>
  );
}
