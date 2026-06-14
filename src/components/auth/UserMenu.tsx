"use client";

import { SignOutButton } from "./SignOutButton";
import { useSafeSession } from "./useSafeSession";

export function UserMenu() {
  const session = useSafeSession();
  const email = session?.user?.email;
  const name = session?.user?.name;

  if (!email) return null;

  return (
    <div className="space-y-2">
      <div className="min-w-0">
        {name && (
          <p className="truncate text-sm font-medium text-brand-off-white">
            {name}
          </p>
        )}
        <p className="truncate text-xs text-brand-muted">{email}</p>
      </div>
      <SignOutButton />
    </div>
  );
}
