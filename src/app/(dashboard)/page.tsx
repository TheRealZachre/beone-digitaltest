import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default function IntroductionPage() {
  return (
    <>
      <Header
        title="BeOne Medicines Digital Analytics"
        subtitle="Demonstration environment for exploring sample social performance reporting"
      />

      <div className="mx-auto w-full max-w-3xl px-8 py-10">
        <div className="rounded-2xl border border-brand-indigo/20 bg-brand-indigo/5 p-6">
          <div className="flex gap-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-brand-indigo" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-indigo">
                Demo environment
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink">
                This is a demo website for BeOne Medicines. It is intended to
                showcase how digital analytics reporting could be presented, not
                to support day-to-day business operations without a
                proper license.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-brand-muted">
          <p>
            Welcome to the BeOne Medicines digital analytics demo. The dashboards
            and reports in this environment illustrate how cross-channel social
            performance might be summarized for internal review and stakeholder
            conversations.
          </p>

          <div>
            <h2 className="text-base font-semibold text-brand-ink">
              Important limitations
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                This is a demo-only site and should not be used for day-to-day
                business decisions or operational workflows.
              </li>
              <li>
                The information shown here may not be accurate, complete, or
                current. Figures, trends, and narratives are provided for
                illustration purposes only.
              </li>
              <li>
                Paid social media activity is not included in this demo. Organic
                and owned-channel reporting is shown as a sample only.
              </li>
            </ul>
          </div>

          <p>
            Use the Analytics section in the sidebar to explore sample channel
            summaries, weekly and monthly reports, and scoring methodology. If
            you have questions about production reporting, please contact your
            BeOne Medicines digital team.
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/reports/channels"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-indigo px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-indigo-bright"
          >
            View Analytics
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
