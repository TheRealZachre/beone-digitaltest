import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { WEBSITE_SEO_PRODUCT_NAME } from "@/lib/website-seo/content";
import { WebsiteSeoSubnav } from "./WebsiteSeoSubnav";

interface WebsiteSeoPageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function WebsiteSeoPageShell({
  title,
  subtitle,
  children,
}: WebsiteSeoPageShellProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <WebsiteSeoSubnav />
      <div className="space-y-8 p-8">{children}</div>
    </>
  );
}

export function WebsiteSeoHero() {
  return (
    <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white">
          <Globe className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {WEBSITE_SEO_PRODUCT_NAME}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Scan any website on demand and get a comprehensive, actionable SEO
            analysis — what is working, what is broken, why it matters, and how
            to fix it.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/website-seo/audit"
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-medium text-teal-700 hover:bg-teal-50"
            >
              Run an audit
            </Link>
            <Link
              href="/website-seo/coverage"
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-medium text-teal-700 hover:bg-teal-50"
            >
              Search engine coverage
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
      className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-teal-200 hover:bg-teal-50/30"
    >
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-teal-700">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-600" />
    </Link>
  );
}
