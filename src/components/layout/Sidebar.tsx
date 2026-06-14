"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AtSign,
  BookOpen,
  Calendar,
  CalendarDays,
  CalendarRange,
  ChevronDown,
  FileBarChart,
  Image,
  Layers,
  Play,
  Share2,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { UserMenu } from "@/components/auth/UserMenu";
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
  links: NavLink[];
}

const analyticsSection: NavSection = {
  id: "analytics",
  label: "Analytics",
  icon: FileBarChart,
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
};

export function Sidebar({ showAdminNav = false }: { showAdminNav?: boolean }) {
  const pathname = usePathname();
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const adminActive = pathname.startsWith("/admin");

  useEffect(() => {
    if (adminActive) {
      setAnalyticsOpen(false);
    }
  }, [adminActive]);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-brand-border bg-brand-stage text-brand-off-white">
      <div className="border-b border-brand-border px-5 py-5">
        <BrandLogo />
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
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

        <div className="mt-2">
          <button
            type="button"
            onClick={() => setAnalyticsOpen((open) => !open)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-muted transition-colors hover:bg-white/5 hover:text-brand-off-white"
            aria-expanded={analyticsOpen}
          >
            <FileBarChart className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left leading-snug">
              {analyticsSection.label}
            </span>
            <ChevronDown
              className={clsx(
                "h-4 w-4 shrink-0 transition-transform",
                analyticsOpen ? "rotate-0" : "-rotate-90"
              )}
            />
          </button>

          {analyticsOpen && (
            <div className="ml-5 mt-1 space-y-0.5 border-l border-brand-border pl-3">
              {analyticsSection.links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-brand-muted transition-colors hover:bg-white/5 hover:text-brand-off-white"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
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
