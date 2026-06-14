"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  BookMarked,
  Calendar,
  CalendarDays,
  CalendarRange,
  ArrowLeftRight,
  AtSign,
  Bell,
  ChevronDown,
  Clapperboard,
  Crown,
  Eye,
  FileBarChart,
  Gauge,
  Globe,
  Image,
  LayoutDashboard,
  Layers,
  LineChart,
  ListChecks,
  Mic,
  Mic2,
  Package,
  PenLine,
  Play,
  Radar,
  Search,
  Share2,
  Shield,
  ShieldAlert,
  Sparkles,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { UserMenu } from "@/components/auth/UserMenu";
import {
  analyticsHref,
  getAnalyticsAppUrl,
} from "@/lib/analytics-app-url";
import { PLATFORM_NAME } from "@/lib/company";

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
  links: NavLink[];
}

const navSections: NavSection[] = [
  {
    id: "analytics",
    label: "Analytics",
    icon: FileBarChart,
    isActive: () => false,
    links: [
      {
        href: "/reports/channels",
        label: "All Channels",
        icon: Layers,
        exact: true,
      },
      { href: "/reports/channels/linkedin", label: "LinkedIn", icon: Share2 },
      { href: "/reports/channels/instagram", label: "Instagram", icon: Image },
      { href: "/reports/channels/facebook", label: "Facebook", icon: Users },
      { href: "/reports/channels/x", label: "X", icon: AtSign },
      { href: "/reports/channels/youtube", label: "YouTube", icon: Play },
      { href: "/reports/weekly", label: "Weekly Report", icon: Calendar },
      { href: "/reports/monthly", label: "Monthly Report", icon: CalendarDays },
      {
        href: "/reports/quarterly",
        label: "Quarterly One-Pager",
        icon: CalendarRange,
      },
      { href: "/methodology", label: "Scoring Methodology", icon: BookOpen },
    ],
  },
  {
    id: "youtube",
    label: "YouTube SEO Optimizer",
    icon: Video,
    isActive: (pathname) => pathname.startsWith("/youtube"),
    links: [
      { href: "/youtube", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/youtube/channel", label: "Channel Analyzer", icon: Search },
      { href: "/youtube/analyze", label: "Video SEO Tool", icon: Sparkles },
      { href: "/youtube/seo-score", label: "SEO Scoring", icon: Gauge },
      { href: "/youtube/visibility", label: "Brand Visibility", icon: Eye },
      { href: "/youtube/seo-packages", label: "SEO Packages", icon: Package },
    ],
  },
  {
    id: "website-seo",
    label: "Website SEO Audit",
    icon: Globe,
    isActive: (pathname) => pathname.startsWith("/website-seo"),
    links: [
      {
        href: "/website-seo",
        label: "Overview",
        icon: LayoutDashboard,
        exact: true,
      },
      { href: "/website-seo/audit", label: "Run Audit", icon: Search },
      { href: "/website-seo/coverage", label: "Search Coverage", icon: Globe },
      { href: "/website-seo/output", label: "Audit Output", icon: ListChecks },
    ],
  },
  {
    id: "voice-training",
    label: "Voice Profile Training",
    icon: Mic2,
    isActive: (pathname) => pathname.startsWith("/voice-training"),
    links: [
      {
        href: "/voice-training",
        label: "Overview",
        icon: LayoutDashboard,
        exact: true,
      },
      { href: "/voice-training/train", label: "Train Profile", icon: Mic },
      { href: "/voice-training/draft", label: "Draft in Voice", icon: PenLine },
    ],
  },
  {
    id: "video-production",
    label: "AI Video Production",
    icon: Clapperboard,
    isActive: (pathname) => pathname.startsWith("/video-production"),
    links: [
      {
        href: "/video-production",
        label: "Overview",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: "/video-production/studio",
        label: "Production Studio",
        icon: Sparkles,
      },
      {
        href: "/video-production/distribution",
        label: "Distribution",
        icon: Share2,
      },
      {
        href: "/video-production/capabilities",
        label: "Capabilities",
        icon: ListChecks,
      },
    ],
  },
  {
    id: "predictive",
    label: "Predictive Performance",
    icon: LineChart,
    isActive: (pathname) => pathname.startsWith("/predictive"),
    links: [
      {
        href: "/predictive",
        label: "Overview",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: "/predictive/draft",
        label: "Draft & Predict",
        icon: PenLine,
      },
    ],
  },
  {
    id: "cross-channel",
    label: "Cross-Channel Orchestration",
    icon: ArrowLeftRight,
    isActive: (pathname) => pathname.startsWith("/cross-channel"),
    links: [
      {
        href: "/cross-channel",
        label: "Overview",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: "/cross-channel/recommendations",
        label: "Recommendations",
        icon: Sparkles,
      },
    ],
  },
  {
    id: "media-monitor",
    label: "Media Monitor",
    icon: Radar,
    isActive: (pathname) => pathname.startsWith("/media-monitor"),
    links: [
      {
        href: "/media-monitor",
        label: "Overview",
        icon: LayoutDashboard,
        exact: true,
      },
      { href: "/media-monitor/search", label: "Search Subject", icon: Search },
    ],
  },
  {
    id: "reputation",
    label: "Reputation Early Warning",
    icon: ShieldAlert,
    isActive: (pathname) => pathname.startsWith("/reputation"),
    links: [
      {
        href: "/reputation",
        label: "Overview",
        icon: LayoutDashboard,
        exact: true,
      },
      { href: "/reputation/monitor", label: "Monitor", icon: Radar },
      { href: "/reputation/alerts", label: "Slack Alerts", icon: Bell },
    ],
  },
  {
    id: "wikipedia",
    label: "Wikipedia Audit",
    icon: BookMarked,
    isActive: (pathname) => pathname.startsWith("/wikipedia"),
    links: [
      {
        href: "/wikipedia",
        label: "Overview",
        icon: LayoutDashboard,
        exact: true,
      },
      { href: "/wikipedia/audit", label: "Run Audit", icon: Search },
      {
        href: "/wikipedia/recommendations",
        label: "What We Check",
        icon: ListChecks,
      },
    ],
  },
  {
    id: "csuite",
    label: "C-Suite Content Engine",
    icon: Crown,
    isActive: (pathname) => pathname.startsWith("/csuite"),
    links: [
      {
        href: "/csuite",
        label: "Overview",
        icon: LayoutDashboard,
        exact: true,
      },
      { href: "/csuite/generate", label: "Generate Content", icon: Sparkles },
      { href: "/csuite/voice", label: "Voice Calibration", icon: Mic },
      { href: "/csuite/output", label: "Output Types", icon: PenLine },
      { href: "/csuite/reports", label: "Performance Reports", icon: FileBarChart },
    ],
  },
];

function linkIsActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

export function Sidebar({ showAdminNav = false }: { showAdminNav?: boolean }) {
  const pathname = usePathname();
  const analyticsAppUrl = getAnalyticsAppUrl();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      navSections.map((section) => [section.id, section.isActive(pathname)])
    )
  );

  useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev };
      for (const section of navSections) {
        if (section.isActive(pathname)) {
          next[section.id] = true;
        }
      }
      return next;
    });
  }, [pathname]);

  const overviewActive = pathname === "/";
  const adminActive = pathname.startsWith("/admin");

  function toggleSection(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-brand-border bg-brand-stage text-brand-off-white">
      <div className="border-b border-brand-border px-5 py-5">
        <BrandLogo />
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        <Link
          href="/"
          className={clsx(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            overviewActive
              ? "bg-brand-indigo/15 text-brand-indigo-bright"
              : "text-brand-muted hover:bg-white/5 hover:text-brand-off-white"
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          Overview
        </Link>

        {showAdminNav && (
          <Link
            href="/admin"
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              adminActive
                ? "bg-brand-indigo/15 text-brand-indigo-bright"
                : "text-brand-muted hover:bg-white/5 hover:text-brand-off-white"
            )}
          >
            <Shield className="h-4 w-4 shrink-0" />
            Platform Admin
          </Link>
        )}

        {navSections.map((section) => {
          const isOpen = openSections[section.id] ?? false;
          const sectionActive = section.isActive(pathname);
          const SectionIcon = section.icon;

          return (
            <div key={section.id} className="mt-2">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  sectionActive
                    ? "bg-brand-indigo/10 text-brand-indigo-bright"
                    : "text-brand-muted hover:bg-white/5 hover:text-brand-off-white"
                )}
                aria-expanded={isOpen}
              >
                <SectionIcon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left leading-snug">
                  {section.label}
                </span>
                <ChevronDown
                  className={clsx(
                    "h-4 w-4 shrink-0 transition-transform",
                    isOpen ? "rotate-0" : "-rotate-90"
                  )}
                />
              </button>

              {isOpen && (
                <div className="ml-5 mt-1 space-y-0.5 border-l border-brand-border pl-3">
                  {section.links.map(({ href, label, icon: Icon, exact }) => {
                    const resolvedHref =
                      section.id === "analytics"
                        ? analyticsHref(href, analyticsAppUrl)
                        : href;
                    const active =
                      section.id === "analytics"
                        ? false
                        : linkIsActive(pathname, href, exact);
                    const linkClassName = clsx(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-indigo/15 text-brand-indigo-bright"
                        : "text-brand-muted hover:bg-white/5 hover:text-brand-off-white"
                    );

                    return (
                      <a
                        key={href}
                        href={resolvedHref}
                        className={linkClassName}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {label}
                      </a>
                    );
                  })}
                  {section.id === "analytics" && showAdminNav && (
                    <a
                      href={analyticsHref("/admin", analyticsAppUrl)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-brand-muted transition-colors hover:bg-white/5 hover:text-brand-off-white"
                    >
                      <Shield className="h-3.5 w-3.5 shrink-0" />
                      Analytics Admin
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-brand-border p-4 space-y-4">
        <UserMenu />
        <div>
          <p className="text-xs text-brand-muted">Powered by</p>
          <p className="text-sm text-brand-off-white">{PLATFORM_NAME}</p>
        </div>
      </div>
    </aside>
  );
}
