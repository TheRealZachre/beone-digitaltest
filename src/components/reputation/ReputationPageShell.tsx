import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { REPUTATION_PRODUCT_NAME } from "@/lib/reputation/content";
import { ReputationSubnav } from "./ReputationSubnav";

export function ReputationPageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <ReputationSubnav />
      <div className="space-y-8 p-8">{children}</div>
    </>
  );
}

export function ReputationHero() {
  return (
    <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {REPUTATION_PRODUCT_NAME}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Sentiment drift detection on company name, product names, and named
            executives. Slack alert when sentiment drops 10% or more.
          </p>
          <Link
            href="/reputation/monitor"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-medium text-orange-700 hover:bg-orange-50"
          >
            Run sentiment scan
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SubPageLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-orange-200 hover:bg-orange-50/30"
    >
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-orange-700">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-600" />
    </Link>
  );
}
