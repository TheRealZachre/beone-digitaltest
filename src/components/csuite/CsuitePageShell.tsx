import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { CSUITE_PRODUCT_NAME } from "@/lib/csuite/content";
import { CsuiteSubnav } from "./CsuiteSubnav";

interface CsuitePageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function CsuitePageShell({
  title,
  subtitle,
  children,
}: CsuitePageShellProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <CsuiteSubnav />
      <div className="space-y-8 p-8">{children}</div>
    </>
  );
}

export function CsuiteHero() {
  return (
    <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
          <Crown className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {CSUITE_PRODUCT_NAME}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Monitor corporate social channels, extract narratives, and generate
            executive-grade thought leadership — calibrated to each leader&apos;s
            voice across LinkedIn, articles, and X.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/csuite/generate"
              className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-medium text-violet-700 hover:bg-violet-50"
            >
              Generate content
            </Link>
            <Link
              href="/csuite/voice"
              className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-medium text-violet-700 hover:bg-violet-50"
            >
              Calibrate voice
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
      className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-violet-200 hover:bg-violet-50/30"
    >
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-violet-700">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-violet-600" />
    </Link>
  );
}
