import type { ReactNode } from "react";
import { UserWelcomeBar } from "@/components/auth/UserWelcomeBar";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-brand-paper">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-auto">
        <UserWelcomeBar />
        {children}
      </main>
    </div>
  );
}
