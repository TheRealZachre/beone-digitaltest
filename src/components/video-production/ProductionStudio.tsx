"use client";

import { useState } from "react";
import {
  Clapperboard,
  Loader2,
  Mic,
  MonitorPlay,
  Share2,
  Sparkles,
} from "lucide-react";
import {
  AUDIENCE_LABELS,
  getVideoProductionConfig,
} from "@/lib/video-production/config";
import type {
  PresenterStyle,
  VideoAudience,
  VideoProductionPackage,
} from "@/lib/video-production/types";
import { ProductionResults } from "./ProductionResults";

const defaults = getVideoProductionConfig();

const audienceOptions = Object.entries(AUDIENCE_LABELS) as [
  VideoAudience,
  string,
][];

const presenterOptions: { id: PresenterStyle; label: string }[] = [
  { id: "brand-avatar", label: "Brand avatar" },
  { id: "executive-clone", label: "Custom spokesperson model" },
  { id: "neutral-host", label: "Neutral host" },
];

export function ProductionStudio() {
  const [topic, setTopic] = useState(
    "FDA Priority Review for our PD-1 inhibitor program"
  );
  const [keyMessageInput, setKeyMessageInput] = useState(
    "Regulatory milestone accelerates access for patients with HER2+ gastroesophageal cancer\nIndependent data presented at ASCO reinforces clinical benefit\nHub video drives full story across all social spokes"
  );
  const [audience, setAudience] = useState<VideoAudience>(
    "healthcare-professionals"
  );
  const [brandGuidelines, setBrandGuidelines] = useState(
    "Patient-first tone. No superlatives. Cite data. BeOne red (#C8102E) accents."
  );
  const [targetLength, setTargetLength] = useState(6);
  const [presenterStyle, setPresenterStyle] =
    useState<PresenterStyle>("executive-clone");
  const [spokespersonName, setSpokespersonName] = useState(
    defaults.defaultSpokesperson
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoProductionPackage | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const keyMessages = keyMessageInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/video-production/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          keyMessages,
          audience,
          brandGuidelines: brandGuidelines.trim() || undefined,
          targetLengthMinutes: targetLength,
          presenterStyle,
          spokespersonName: spokespersonName.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Generation failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <ProductionResults
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
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { icon: Sparkles, label: "1. Script", sub: "Topic → full script" },
          { icon: Mic, label: "2. AI Presenter", sub: "Text-to-video render" },
          {
            icon: MonitorPlay,
            label: "3. Production",
            sub: "B-roll, graphics, music",
          },
          { icon: Share2, label: "4. Distribution", sub: "Publish all channels" },
        ].map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="rounded-xl border border-fuchsia-100 bg-fuchsia-50/40 p-4"
          >
            <Icon className="h-5 w-5 text-fuchsia-600" />
            <p className="mt-2 text-sm font-semibold text-slate-900">{label}</p>
            <p className="text-xs text-slate-500">{sub}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fuchsia-100 text-fuchsia-700">
            <Clapperboard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Start a video project
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Provide topic and key messages. {defaults.productName} generates
              script, presenter plan, production package, and distribution
              calendar.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            Topic
            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            Key messages (one per line)
            <textarea
              value={keyMessageInput}
              onChange={(event) => setKeyMessageInput(event.target.value)}
              rows={4}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Target audience
            <select
              value={audience}
              onChange={(event) =>
                setAudience(event.target.value as VideoAudience)
              }
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100"
            >
              {audienceOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Target length (minutes)
            <input
              type="number"
              min={3}
              max={20}
              value={targetLength}
              onChange={(event) => setTargetLength(Number(event.target.value))}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            AI presenter style
            <select
              value={presenterStyle}
              onChange={(event) =>
                setPresenterStyle(event.target.value as PresenterStyle)
              }
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100"
            >
              {presenterOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Spokesperson name (optional)
            <input
              value={spokespersonName}
              onChange={(event) => setSpokespersonName(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            Brand guidelines (optional)
            <textarea
              value={brandGuidelines}
              onChange={(event) => setBrandGuidelines(event.target.value)}
              rows={2}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100"
            />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-fuchsia-700 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading
            ? "Generating script, production & distribution…"
            : "Generate full production package"}
        </button>
      </form>
    </div>
  );
}
