"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import clsx from "clsx";
import { DEFAULT_EXECUTIVES } from "@/lib/csuite/executives";
import type { ExecutiveProfile, TargetAudience, WritingStyle } from "@/lib/csuite/types";

const STORAGE_KEY = "csuite-voice-overrides";

const STYLE_OPTIONS: WritingStyle[] = [
  "authoritative",
  "conversational",
  "visionary",
  "data-driven",
];

const AUDIENCE_OPTIONS: TargetAudience[] = [
  "peers",
  "prospects",
  "policymakers",
  "press",
  "employees",
  "investors",
];

export function VoiceCalibrationPanel() {
  const [executiveId, setExecutiveId] = useState(DEFAULT_EXECUTIVES[0].id);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<ExecutiveProfile>(
    DEFAULT_EXECUTIVES[0]
  );

  useEffect(() => {
    const exec = DEFAULT_EXECUTIVES.find((e) => e.id === executiveId);
    if (!exec) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const overrides = JSON.parse(stored) as Partial<ExecutiveProfile>;
        setProfile({ ...exec, ...overrides });
        return;
      }
    } catch {
      // ignore
    }
    setProfile(exec);
  }, [executiveId]);

  function toggleStyle(style: WritingStyle) {
    setProfile((prev) => {
      const has = prev.writingStyles.includes(style);
      const next = has
        ? prev.writingStyles.filter((s) => s !== style)
        : [...prev.writingStyles, style];
      return { ...prev, writingStyles: next.length ? next : [style] };
    });
  }

  function toggleAudience(audience: TargetAudience) {
    setProfile((prev) => {
      const has = prev.targetAudiences.includes(audience);
      const next = has
        ? prev.targetAudiences.filter((a) => a !== audience)
        : [...prev.targetAudiences, audience];
      return { ...prev, targetAudiences: next.length ? next : [audience] };
    });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const overrides = {
      writingStyles: profile.writingStyles,
      passionTopics: profile.passionTopics,
      usePhrases: profile.usePhrases,
      avoidPhrases: profile.avoidPhrases,
      targetAudiences: profile.targetAudiences,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Executive voice calibration
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Tune how content is generated for each leader. Settings persist in your
          browser and apply to the content generator.
        </p>

        <label className="mt-6 block text-sm font-medium text-slate-700">
          Executive
          <select
            value={executiveId}
            onChange={(e) => setExecutiveId(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          >
            {DEFAULT_EXECUTIVES.map((exec) => (
              <option key={exec.id} value={exec.id}>
                {exec.name} — {exec.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Preferred writing style</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => toggleStyle(style)}
              className={clsx(
                "rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                profile.writingStyles.includes(style)
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Topics of passion</h3>
        <textarea
          value={profile.passionTopics.join("\n")}
          onChange={(e) =>
            setProfile((prev) => ({
              ...prev,
              passionTopics: e.target.value
                .split("\n")
                .map((t) => t.trim())
                .filter(Boolean),
            }))
          }
          rows={4}
          placeholder="One topic per line"
          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Phrases to use</h3>
          <textarea
            value={profile.usePhrases.join("\n")}
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                usePhrases: e.target.value
                  .split("\n")
                  .map((t) => t.trim())
                  .filter(Boolean),
              }))
            }
            rows={4}
            className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Phrases to avoid</h3>
          <textarea
            value={profile.avoidPhrases.join("\n")}
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                avoidPhrases: e.target.value
                  .split("\n")
                  .map((t) => t.trim())
                  .filter(Boolean),
              }))
            }
            rows={4}
            className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Target audience</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {AUDIENCE_OPTIONS.map((audience) => (
            <button
              key={audience}
              type="button"
              onClick={() => toggleAudience(audience)}
              className={clsx(
                "rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                profile.targetAudiences.includes(audience)
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {audience}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
      >
        <Save className="h-4 w-4" />
        {saved ? "Saved!" : "Save voice settings"}
      </button>
    </form>
  );
}
