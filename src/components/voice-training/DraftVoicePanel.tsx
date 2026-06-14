"use client";

import { useState } from "react";
import { Copy, Loader2, PenLine } from "lucide-react";
import { DEFAULT_EXECUTIVES } from "@/lib/csuite/executives";
import { formatVoiceDraftForExport } from "@/lib/voice-training/format-export";
import type { VoiceDraftResult } from "@/lib/voice-training/types";

export function DraftVoicePanel() {
  const [executiveId, setExecutiveId] = useState(DEFAULT_EXECUTIVES[0].id);
  const [topic, setTopic] = useState(
    "ASCO 2026 solid tumor pipeline momentum"
  );
  const [keyPoint, setKeyPoint] = useState(
    "Three programs are approaching phase 3 — the question is what this means for patients waiting for options."
  );
  const [format, setFormat] = useState<
    "linkedin-post" | "linkedin-article" | "x-post"
  >("linkedin-post");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<VoiceDraftResult | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/voice-training/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          executiveId,
          topic: topic.trim(),
          keyPoint: keyPoint.trim() || undefined,
          format,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Draft failed");
      setDraft(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (draft) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                Drafted in {draft.executiveName}&apos;s voice
              </p>
              <h2 className="mt-1 font-semibold text-slate-900">{draft.topic}</h2>
              <p className="text-xs text-slate-500">
                {draft.format} · {draft.charCount} characters
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                void navigator.clipboard.writeText(
                  formatVoiceDraftForExport(draft)
                )
              }
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
            >
              <Copy className="h-4 w-4" />
              Copy draft
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">
            {draft.content}
          </pre>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Voice match notes</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {draft.voiceMatchNotes.map((note) => (
                <li key={note} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Signatures applied</h3>
            <p className="mt-2 text-sm text-slate-600">
              {draft.signaturesUsed.join(" · ")}
            </p>
            <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Phrases blocked
            </h4>
            <p className="mt-1 text-sm text-slate-600">
              {draft.avoidedPhrases.join(", ")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDraft(null)}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Draft another topic
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
          <PenLine className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Draft content in executive voice
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Uses the trained voice profile — not generic comms copy.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
          Executive
          <select
            value={executiveId}
            onChange={(event) => setExecutiveId(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          >
            {DEFAULT_EXECUTIVES.map((executive) => (
              <option key={executive.id} value={executive.id}>
                {executive.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
          Topic
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
            required
          />
        </label>

        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
          Key point (optional)
          <textarea
            value={keyPoint}
            onChange={(event) => setKeyPoint(event.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Format
          <select
            value={format}
            onChange={(event) =>
              setFormat(
                event.target.value as
                  | "linkedin-post"
                  | "linkedin-article"
                  | "x-post"
              )
            }
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          >
            <option value="linkedin-post">LinkedIn post</option>
            <option value="linkedin-article">LinkedIn article</option>
            <option value="x-post">X post</option>
          </select>
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PenLine className="h-4 w-4" />
        )}
        {loading ? "Drafting in voice…" : "Generate draft"}
      </button>
    </form>
  );
}
