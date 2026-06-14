import { AppShell } from "@/components/layout/AppShell";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const showAdminNav = session?.user?.role === "admin";

  return <AppShell showAdminNav={showAdminNav}>{children}</AppShell>;
}
