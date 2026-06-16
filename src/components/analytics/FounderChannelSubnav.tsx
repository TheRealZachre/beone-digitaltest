"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const FOUNDER_CHANNELS = [
  {
    id: "all",
    label: "All Channels",
    href: "/founder/reports/channels",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "/founder/reports/channels/linkedin",
  },
  {
    id: "x",
    label: "X",
    href: "/founder/reports/channels/x",
  },
] as const;

export function FounderChannelSubnav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-slate-200 bg-white px-8">
      <nav className="flex gap-1 overflow-x-auto py-3">
        {FOUNDER_CHANNELS.map((channel) => {
          const active =
            channel.id === "all"
              ? pathname === "/founder/reports/channels"
              : pathname === channel.href;

          return (
            <Link
              key={channel.id}
              href={channel.href}
              className={clsx(
                "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              {channel.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
