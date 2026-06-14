"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/voice-training", label: "Overview", exact: true },
  { href: "/voice-training/train", label: "Train Profile" },
  { href: "/voice-training/draft", label: "Draft in Voice" },
];

export function VoiceTrainingSubnav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-slate-200 bg-white px-8">
      <nav className="-mb-px flex gap-6 overflow-x-auto">
        {links.map(({ href, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-rose-600 text-rose-700"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
