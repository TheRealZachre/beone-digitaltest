"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/cross-channel", label: "Overview", exact: true },
  { href: "/cross-channel/recommendations", label: "Recommendations" },
];

export function CrossChannelSubnav() {
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
                  ? "border-violet-600 text-violet-700"
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
