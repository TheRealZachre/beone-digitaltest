import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Clapperboard } from "lucide-react";
import { Header } from "@/components/layout/Header";
import {
  VIDEO_PRODUCTION_BRAND,
  VIDEO_PRODUCTION_PRODUCT_NAME,
} from "@/lib/video-production/content";
import { VideoProductionSubnav } from "./VideoProductionSubnav";

interface VideoProductionPageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function VideoProductionPageShell({
  title,
  subtitle,
  children,
}: VideoProductionPageShellProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <VideoProductionSubnav />
      <div className="space-y-8 p-8">{children}</div>
    </>
  );
}

export function VideoProductionHero() {
  return (
    <div className="rounded-xl border border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 via-white to-violet-50 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-fuchsia-600 text-white">
          <Clapperboard className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-700">
            {VIDEO_PRODUCTION_BRAND}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {VIDEO_PRODUCTION_PRODUCT_NAME}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Provide a topic, key messages, or source content — we handle
            scriptwriting, AI presenter recording, full production, and
            multi-channel publish.
          </p>
          <Link
            href="/video-production/studio"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-white px-3 py-1 text-xs font-medium text-fuchsia-700 hover:bg-fuchsia-50"
          >
            Open Production Studio
          </Link>
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
      className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-fuchsia-200 hover:bg-fuchsia-50/30"
    >
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-fuchsia-700">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-fuchsia-600" />
    </Link>
  );
}
