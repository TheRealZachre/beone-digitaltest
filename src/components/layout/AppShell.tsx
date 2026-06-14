import type { ReactNode } from "react";
import { UserWelcomeBar } from "@/components/auth/UserWelcomeBar";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
  showAdminNav?: boolean;
}

export function AppShell({ children, showAdminNav = false }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-brand-paper">
      <Sidebar showAdminNav={showAdminNav} />
      <main className="flex flex-1 flex-col overflow-auto">
        <UserWelcomeBar />
        {children}
      </main>
    </div>
  );
}
