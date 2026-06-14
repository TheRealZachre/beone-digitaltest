import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  Clapperboard,
  Crown,
  ExternalLink,
  FileBarChart,
  Globe,
  LineChart,
  Mic2,
  Radar,
  ShieldAlert,
  Video,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BrandSignalAnimated } from "@/components/brand/BrandSignalAnimated";
import { analyticsHref, getAnalyticsAppUrl } from "@/lib/analytics-app-url";
import { PLATFORM_NAME, PLATFORM_TAGLINE } from "@/lib/company";

const modules = [
  {
    href: "/youtube",
    title: "YouTube SEO Optimizer",
    description: "Channel analysis, video SEO scoring, and visibility tracking.",
    icon: Video,
  },
  {
    href: "/website-seo",
    title: "Website SEO Audit",
    description: "Run audits, review search coverage, and export recommendations.",
    icon: Globe,
  },
  {
    href: "/voice-training",
    title: "Voice Profile Training",
    description: "Train brand voice profiles and draft content in your tone.",
    icon: Mic2,
  },
  {
    href: "/video-production",
    title: "AI Video Production",
    description: "Generate scripts, platform clips, and distribution plans.",
    icon: Clapperboard,
  },
  {
    href: "/predictive",
    title: "Predictive Performance",
    description: "Forecast engagement before you publish.",
    icon: LineChart,
  },
  {
    href: "/cross-channel",
    title: "Cross-Channel Orchestration",
    description: "Coordinate messaging and timing across platforms.",
    icon: ArrowLeftRight,
  },
  {
    href: "/media-monitor",
    title: "Media Monitor",
    description: "Track news coverage and major social posts by subject.",
    icon: Radar,
  },
  {
    href: "/reputation",
    title: "Reputation Early Warning",
    description: "Monitor sentiment and alert on emerging issues.",
    icon: ShieldAlert,
  },
  {
    href: "/csuite",
    title: "C-Suite Content Engine",
    description: "Executive content packages aligned to corporate themes.",
    icon: Crown,
  },
];

export default function DashboardHubPage() {
  const analyticsUrl = getAnalyticsAppUrl();
  const analyticsOverview = analyticsHref("/", analyticsUrl);

  return (
    <>
      <Header
        title="Digital Dashboard"
        subtitle={`${PLATFORM_NAME} · ${PLATFORM_TAGLINE}`}
      />

      <div className="space-y-10 p-8">
        <section className="overflow-hidden rounded-2xl border border-brand-indigo/20 bg-gradient-to-br from-brand-indigo/10 via-white to-brand-paper p-8 shadow-sm">
          <BrandSignalAnimated className="mb-6 h-8 w-auto opacity-90" />
          <h2 className="text-2xl font-semibold tracking-tight text-brand-ink">
            Intelligence & orchestration hub
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted">
            Social analytics live in a dedicated app. Use the modules below for
            SEO, content production, monitoring, and executive workflows.
          </p>
          <a
            href={analyticsOverview}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-indigo px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-indigo-bright"
          >
            <FileBarChart className="h-4 w-4" />
            Open BeOne Analytics
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </a>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-muted">
            Product modules
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {modules.map(({ href, title, description, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-indigo/30 hover:shadow-md"
              >
                <Icon className="h-5 w-5 text-brand-indigo" />
                <h4 className="mt-3 font-semibold text-brand-ink group-hover:text-brand-indigo">
                  {title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">
                  {description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-indigo">
                  Open module
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
