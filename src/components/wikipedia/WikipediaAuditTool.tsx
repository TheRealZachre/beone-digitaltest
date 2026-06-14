"use client";

import { useState } from "react";
import { BookOpen, Loader2, Search } from "lucide-react";
import { getWikipediaConfig } from "@/lib/wikipedia/config";
import type { WikipediaAuditResponse } from "@/lib/wikipedia/types";
import { WikipediaAuditResults } from "./WikipediaAuditResults";

const defaults = getWikipediaConfig();

export function WikipediaAuditTool() {
  const [companyPage, setCompanyPage] = useState(defaults.companyPage);
  const [ceoPage, setCeoPage] = useState(defaults.ceoPage);
  const [companyName, setCompanyName] = useState(defaults.companyName);
  const [ceoName, setCeoName] = useState(defaults.ceoName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WikipediaAuditResponse | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/wikipedia/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyPage: companyPage.trim(),
          ceoPage: ceoPage.trim(),
          companyName: companyName.trim(),
          ceoName: ceoName.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Audit failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <WikipediaAuditResults
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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">
              Audit company & CEO Wikipedia pages
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fetches live English Wikipedia articles via the MediaWiki API and
              generates prioritized update recommendations.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Company page title or URL
            <input
              value={companyPage}
              onChange={(event) => setCompanyPage(event.target.value)}
              placeholder="BeOne Medicines"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            CEO page title or URL
            <input
              value={ceoPage}
              onChange={(event) => setCeoPage(event.target.value)}
              placeholder="John V. Oyler"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Display name (company)
            <input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Display name (CEO)
            <input
              value={ceoName}
              onChange={(event) => setCeoName(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              required
            />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          {loading ? "Analyzing Wikipedia pages…" : "Run Wikipedia audit"}
        </button>
      </form>

      <p className="text-xs text-slate-400">
        Defaults to BeOne Medicines and John V. Oyler. Override with any public
        company and executive Wikipedia titles. Recommendations follow Wikipedia
        neutral-point-of-view and verifiability guidelines — not promotional
        editing.
      </p>
    </div>
  );
}
