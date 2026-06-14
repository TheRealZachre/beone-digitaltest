import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Video } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { YOUTUBE_PRODUCT_NAME } from "@/lib/youtube/content";
import { YouTubeSubnav } from "./YouTubeSubnav";

interface YouTubePageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function YouTubePageShell({
  title,
  subtitle,
  children,
}: YouTubePageShellProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <YouTubeSubnav />
      <div className="space-y-8 p-8">{children}</div>
    </>
  );
}

export function YouTubeHero() {
  return (
    <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
          <Video className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {YOUTUBE_PRODUCT_NAME}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Connect your channel, score every video, generate SEO packages
            automatically, and track brand visibility over time — no more
            copy-paste between AI tools and YouTube Studio.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/youtube/channel"
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
            >
              Analyze a channel
            </Link>
            <Link
              href="/youtube/analyze"
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
            >
              Upload a video
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SubPageLinkProps {
  href: string;
  title: string;
  description: string;
}

export function SubPageLink({ href, title, description }: SubPageLinkProps) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50/30"
    >
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-red-700">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-red-600" />
    </Link>
  );
}
