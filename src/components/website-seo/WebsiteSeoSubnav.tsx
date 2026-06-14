"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { WEBSITE_SEO_NAV } from "@/lib/website-seo/content";

export function WebsiteSeoSubnav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-slate-200 bg-white px-8">
      <nav className="flex gap-1 overflow-x-auto py-3">
        {WEBSITE_SEO_NAV.map((item) => {
          const active =
            "exact" in item && item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
