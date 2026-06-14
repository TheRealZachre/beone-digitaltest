"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader2, Search, Users, Video } from "lucide-react";
import { SeoScoreBadge } from "./SeoScoreBadge";
import type { ChannelAnalyzeResponse } from "@/lib/youtube/types";
import { sanitizeUserFacingText } from "@/lib/format-display-provider";

export function ChannelAnalyzer() {
  const [channelUrl, setChannelUrl] = useState("@beonemedicines");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ChannelAnalyzeResponse | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/youtube/channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleAnalyze}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Connect a YouTube channel
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter a channel URL or handle (e.g.{" "}
          <code className="rounded bg-slate-100 px-1">@beonemedicines</code>).
          Pulls live channel avatars and video thumbnails when sync credentials
          or the YouTube Data API are configured.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={channelUrl}
            onChange={(e) => setChannelUrl(e.target.value)}
            placeholder="https://youtube.com/@channel or @handle"
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Analyze channel
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-rose-600">
            {sanitizeUserFacingText(error)}
          </p>
        )}
      </form>

      {result && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start gap-4">
              {result.channel.thumbnailUrl && (
                <Image
                  src={result.channel.thumbnailUrl}
                  alt={result.channel.title}
                  width={72}
                  height={72}
                  unoptimized
                  className="rounded-full"
                />
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {result.channel.title}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    {result.source === "seed"
                      ? "demo data"
                      : result.source === "youtube-api"
                        ? "live · YouTube API"
                        : "live"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  @{result.channel.handle}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {result.channel.subscriberCount.toLocaleString()} subscribers
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    {result.channel.videoCount.toLocaleString()} videos
                  </span>
                </div>
              </div>
            </div>
          </div>

          <section>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Videos ranked by SEO score — optimization opportunities
            </h3>
            <div className="space-y-4">
              {result.videos.map((video, index) => (
                <div
                  key={video.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="relative h-[90px] w-[160px] shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="160px"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-slate-400">
                            #{index + 1} ·{" "}
                            {new Date(video.publishedAt).toLocaleDateString()}
                          </p>
                          <h4 className="mt-1 font-semibold text-slate-900">
                            {video.title}
                          </h4>
                        </div>
                        <SeoScoreBadge score={video.analysis.totalScore} size="md" />
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {video.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>{video.viewCount.toLocaleString()} views</span>
                        <span>{video.likeCount.toLocaleString()} likes</span>
                        <span>{video.tags.length} tags</span>
                      </div>

                      {video.analysis.recommendations.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {video.analysis.recommendations.map((rec, i) => (
                            <li
                              key={`${video.id}-rec-${i}`}
                              className="text-sm text-amber-800 before:mr-2 before:content-['→']"
                            >
                              {rec}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
