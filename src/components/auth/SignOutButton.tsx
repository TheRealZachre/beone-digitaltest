"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-brand-muted transition-colors hover:bg-white/5 hover:text-brand-off-white"
    >
      <LogOut className="h-3.5 w-3.5 shrink-0" />
      Sign out
    </button>
  );
}
