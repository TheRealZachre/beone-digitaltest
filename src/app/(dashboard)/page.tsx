import Link from "next/link";
import { AlertTriangle, ArrowRight, User } from "lucide-react";
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
            View Corporate
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-brand-ink">
                Founder / CEO Social Analytics
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                This section tracks the personal social media presence of{" "}
                <span className="font-medium text-brand-ink">John V. Oyler</span>,
                Co-Founder, Chairman &amp; CEO of BeOne Medicines, across his
                LinkedIn and X (Twitter) profiles.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                It works exactly the same way as the corporate Analytics section —
                pulling live post data via the same sync engine, calculating
                engagement rates and story beats, and generating weekly, monthly,
                and quarterly reports. The only difference is that the data source
                is John&rsquo;s personal profiles (
                <a
                  href="https://www.linkedin.com/in/john-v-oyler/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline-offset-2 hover:underline"
                >
                  linkedin.com/in/john-v-oyler
                </a>{" "}
                and{" "}
                <a
                  href="https://x.com/johnvoyler"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline-offset-2 hover:underline"
                >
                  @johnvoyler
                </a>
                ) rather than the BeOne corporate channels.
              </p>
              <div className="mt-5">
                <Link
                  href="/founder/reports/channels"
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                >
                  View Founder / CEO Analytics
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
