"use client";

import Link from "next/link";
import { useSafeSession } from "@/components/auth/useSafeSession";

function displayName(name: string | null | undefined, email: string | null | undefined) {
  if (name?.trim()) {
    return name.trim().split(/\s+/)[0];
  }
  if (email) {
    return email.split("@")[0];
  }
  return null;
}

export function UserWelcomeBar() {
  const session = useSafeSession();
  const name = displayName(session?.user?.name, session?.user?.email);

  if (!name) return null;

  return (
    <div className="flex shrink-0 items-center justify-end border-b border-brand-ink/10 bg-[#FFFEFB] px-8 py-3">
      <p className="text-sm text-brand-muted">
        Welcome,{" "}
        <Link
          href="/account"
          className="font-medium text-brand-ink underline-offset-2 hover:text-brand-indigo hover:underline"
        >
          {name}
        </Link>
      </p>
    </div>
  );
}
