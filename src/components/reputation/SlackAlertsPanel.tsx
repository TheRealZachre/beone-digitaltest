import { Bell, Webhook } from "lucide-react";
import { getMonitoredEntities } from "@/lib/reputation/config";

export function SlackAlertsPanel({
  slackConfigured,
}: {
  slackConfigured: boolean;
}) {
  const entities = getMonitoredEntities();

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
            <Webhook className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Slack integration
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              When sentiment drops 10% or more vs baseline, a structured alert is
              posted to your Slack channel.
            </p>
            <p
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                slackConfigured
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {slackConfigured
                ? "SLACK_WEBHOOK_URL configured"
                : "SLACK_WEBHOOK_URL not set — alerts shown in dashboard only"}
            </p>
          </div>
        </div>

        <pre className="mt-6 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
{`# .env.local
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
REPUTATION_DRIFT_THRESHOLD=10`}
        </pre>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900">
          <Bell className="h-4 w-4 text-orange-600" />
          Alert payload includes
        </h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>Entity name (company, product, or executive)</li>
          <li>Current vs baseline sentiment score</li>
          <li>Drift percentage (triggers at −10% or worse)</li>
          <li>Summary of recent mention volume</li>
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">
          Monitored entities ({entities.length})
        </h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {entities.map((entity) => (
            <li
              key={entity.id}
              className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="font-medium text-slate-800">{entity.label}</span>
              <span className="ml-2 text-xs capitalize text-slate-500">
                {entity.type}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
