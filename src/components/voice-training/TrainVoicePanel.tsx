"use client";

import { useState } from "react";
import { Loader2, Mic } from "lucide-react";
import { DEFAULT_EXECUTIVES } from "@/lib/csuite/executives";
import type { VoiceProfile } from "@/lib/voice-training/types";
import { VoiceProfileCard } from "./VoiceProfileCard";

export function TrainVoicePanel() {
  const [executiveId, setExecutiveId] = useState(DEFAULT_EXECUTIVES[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<VoiceProfile | null>(null);

  async function handleTrain(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/voice-training/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ executiveId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Training failed");
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (profile) {
    return (
      <div className="space-y-4">
        <VoiceProfileCard profile={profile} />
        <button
          type="button"
          onClick={() => setProfile(null)}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Train another executive
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleTrain}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
          <Mic className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Train voice profile from past posts
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Analyzes historical LinkedIn and X posts to learn opener patterns,
            sentence rhythm, signature phrases, and comms clichés to avoid.
          </p>
        </div>
      </div>

      <label className="mt-6 block text-sm font-medium text-slate-700">
        Executive
        <select
          value={executiveId}
          onChange={(event) => setExecutiveId(event.target.value)}
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
        >
          {DEFAULT_EXECUTIVES.map((executive) => (
            <option key={executive.id} value={executive.id}>
              {executive.name} — {executive.title}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
        {loading ? "Learning voice profile…" : "Train voice profile"}
      </button>
    </form>
  );
}
