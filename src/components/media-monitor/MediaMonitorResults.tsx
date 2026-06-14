"use client";

import { Copy, Download, ExternalLink, Heart, MessageCircle, Share2 } from "lucide-react";
import clsx from "clsx";
import { formatMediaMonitorForExport } from "@/lib/media-monitor/format-results";
import { formatDisplayProvider, sanitizeUserFacingText } from "@/lib/format-display-provider";
import { SocialPostImage } from "@/components/dashboard/SocialPostImage";
import type { Platform } from "@/lib/types";
import type { MediaMonitorSearchResponse } from "@/lib/media-monitor/types";

interface MediaMonitorResultsProps {
  result: MediaMonitorSearchResponse;
  onReset?: () => void;
}

const platformColors: Record<string, string> = {
  linkedin: "bg-blue-700",
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  facebook: "bg-blue-600",
  x: "bg-slate-800",
  youtube: "bg-red-600",
  reddit: "bg-orange-600",
};

export function MediaMonitorResults({
  result,
  onReset,
}: MediaMonitorResultsProps) {
  function copyText(text: string) {
    void navigator.clipboard.writeText(text);
  }

  function downloadReport() {
    const blob = new Blob([formatMediaMonitorForExport(result)], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${result.subject.toLowerCase().replace(/\s+/g, "-")}-media-monitor.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Results for
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {result.subject}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {result.newsCount} news articles · {result.socialCount} social
              posts · {result.responseTimeMs}ms
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Sources: {result.sourcesUsed.join(" · ")}
            </p>
            {result.errors && (
              <div className="mt-2 space-y-1 text-xs text-amber-700">
                {Object.entries(result.errors).map(([key, message]) => (
                  <p key={key}>
                    {key}: {sanitizeUserFacingText(message ?? "")}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={downloadReport}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              type="button"
              onClick={() => copyText(formatMediaMonitorForExport(result))}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              <Copy className="h-4 w-4" />
              Copy all
            </button>
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                New search
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          News articles ({result.news.length})
        </h3>
        {result.news.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No news articles found for this subject.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {result.news.map((article) => (
              <li
                key={article.id}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-slate-900 hover:text-sky-700"
                    >
                      {article.title}
                    </a>
                    <p className="mt-1 text-xs text-slate-500">
                      {article.source} ·{" "}
                      {new Date(article.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      · {article.provider}
                    </p>
                    {article.snippet && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {article.snippet}
                      </p>
                    )}
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-800"
                  >
                    Open
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          Major social posts ({result.socialPosts.length})
        </h3>
        {result.socialPosts.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No social posts found. Sync social channels or configure live X
            search to pull additional posts.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {result.socialPosts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50"
              >
                {post.imageUrl && post.platform !== "reddit" && (
                  <SocialPostImage
                    imageUrl={post.imageUrl}
                    platform={post.platform as Platform}
                    postId={post.id}
                    containerClassName="h-40"
                  />
                )}
                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={clsx(
                        "rounded-full px-2 py-0.5 text-xs font-semibold capitalize text-white",
                        platformColors[post.platform] ?? "bg-slate-600"
                      )}
                    >
                      {post.platform}
                    </span>
                    <span className="text-xs text-slate-500">
                      {post.author}
                      {post.authorHandle ? ` · ${post.authorHandle}` : ""}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      {formatDisplayProvider(post.provider) ?? post.provider}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate-700">
                    {post.text}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {post.engagement.likes.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {post.engagement.comments.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Share2 className="h-3.5 w-3.5" />
                      {post.engagement.shares.toLocaleString()}
                    </span>
                  </div>
                  {post.url !== "#" && (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-800"
                    >
                      View source
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
