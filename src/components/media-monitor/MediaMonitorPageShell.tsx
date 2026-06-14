import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Radar } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MEDIA_MONITOR_PRODUCT_NAME } from "@/lib/media-monitor/content";
import { MediaMonitorSubnav } from "./MediaMonitorSubnav";

interface MediaMonitorPageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function MediaMonitorPageShell({
  title,
  subtitle,
  children,
}: MediaMonitorPageShellProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <MediaMonitorSubnav />
      <div className="space-y-8 p-8">{children}</div>
    </>
  );
}

export function MediaMonitorHero() {
  return (
    <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white">
          <Radar className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {MEDIA_MONITOR_PRODUCT_NAME}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Enter any subject — company, CEO, product, or topic — to pull recent
            news articles and major social posts in one view.
          </p>
          <Link
            href="/media-monitor/search"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50"
          >
            Search a subject
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
      className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-sky-200 hover:bg-sky-50/30"
    >
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-sky-700">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-sky-600" />
    </Link>
  );
}
