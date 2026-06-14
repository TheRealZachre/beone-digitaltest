"use client";

import { useEffect, useState } from "react";
import { Crown, Loader2, Sparkles } from "lucide-react";
import clsx from "clsx";
import { DEFAULT_EXECUTIVES } from "@/lib/csuite/executives";
import type { CorporateTheme, GeneratedExecutiveContent } from "@/lib/csuite/types";
import { GeneratedContentResults } from "./GeneratedContentResults";

const VOICE_STORAGE_KEY = "csuite-voice-overrides";

export function ContentGenerator() {
  const [executiveId, setExecutiveId] = useState(DEFAULT_EXECUTIVES[0].id);
  const [themes, setThemes] = useState<CorporateTheme[]>([]);
  const [themeId, setThemeId] = useState<string>("");
  const [loadingThemes, setLoadingThemes] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedExecutiveContent | null>(null);
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    async function loadThemes() {
      try {
        const res = await fetch("/api/csuite/themes");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load themes");
        setThemes(data.themes ?? []);
        setThemeId(data.themes?.[0]?.id ?? "");
        setSource(data.source ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load themes");
      } finally {
        setLoadingThemes(false);
      }
    }
    void loadThemes();
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    setError(null);

    let voiceOverrides;
    try {
      const stored = localStorage.getItem(VOICE_STORAGE_KEY);
      if (stored) voiceOverrides = JSON.parse(stored);
    } catch {
      // ignore invalid storage
    }

    try {
      const res = await fetch("/api/csuite/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          executiveId,
          themeId: themeId || undefined,
          voiceOverrides,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  }

  if (result) {
    return (
      <GeneratedContentResults
        result={result}
        onReset={() => setResult(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleGenerate}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Generate executive content
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Pulls themes from recent corporate posts and reframes them through the
          selected executive&apos;s calibrated voice.
          {source && (
            <span className="ml-1 text-slate-400">
              (Data source: {source})
            </span>
          )}
        </p>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-700">Select executive</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {DEFAULT_EXECUTIVES.map((exec) => (
              <button
                key={exec.id}
                type="button"
                onClick={() => setExecutiveId(exec.id)}
                className={clsx(
                  "flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                  executiveId === exec.id
                    ? "border-violet-300 bg-violet-50"
                    : "border-slate-200 hover:border-violet-200"
                )}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                  {exec.avatarInitials}
                </span>
                <div>
                  <p className="font-medium text-slate-900">{exec.name}</p>
                  <p className="text-xs text-slate-500">{exec.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <label className="mt-6 block text-sm font-medium text-slate-700">
          Corporate theme
          <select
            value={themeId}
            onChange={(e) => setThemeId(e.target.value)}
            disabled={loadingThemes || themes.length === 0}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          >
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.title} ({theme.sourcePostIds.length} posts)
              </option>
            ))}
          </select>
        </label>

        {themes[0] && (
          <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-800">Narrative signals</p>
            <p className="mt-1">
              {(themes.find((t) => t.id === themeId) ?? themes[0]).narrative}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Suggested angles:{" "}
              {(themes.find((t) => t.id === themeId) ?? themes[0]).suggestedAngles.join(" · ")}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={generating || loadingThemes || themes.length === 0}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {generating ? "Generating..." : "Generate content package"}
        </button>
      </form>

      {loadingThemes && (
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Scanning corporate channels for themes...
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="rounded-xl border border-violet-100 bg-violet-50/30 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-violet-800">
          <Crown className="h-4 w-4" />
          Voice calibration applied from saved settings
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Adjust writing style, topics, and language patterns on the{" "}
          <a href="/csuite/voice" className="font-medium text-violet-700 hover:underline">
            Voice Calibration
          </a>{" "}
          page before generating.
        </p>
      </div>
    </div>
  );
}
