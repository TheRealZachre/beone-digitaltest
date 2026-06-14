import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AdminUserConsole } from "@/components/admin/AdminUserConsole";
import { auth } from "@/lib/auth";
import { listUsers } from "@/lib/auth/users";
import { analyticsHref, getAnalyticsAppUrl } from "@/lib/analytics-app-url";

export const dynamic = "force-dynamic";

export default async function PlatformAdminPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  const users = await listUsers();
  const analyticsAdminUrl = analyticsHref("/admin", getAnalyticsAppUrl());

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-indigo">
          Platform Admin
        </p>
        <h1 className="mt-2 font-serif text-3xl text-brand-ink">
          Platform Admin Console
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-brand-muted">
          Create username and password accounts for the Digital Dashboard
          platform modules. BeOne Analytics has its own separate admin console
          for analytics-only users.
        </p>
        <a
          href={analyticsAdminUrl}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-indigo transition hover:text-brand-indigo-bright"
        >
          Open Analytics Admin Console
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <AdminUserConsole initialUsers={users} scope="platform" />
    </div>
  );
}
