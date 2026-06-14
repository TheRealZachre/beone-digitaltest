import { MEDIA_MONITOR_SOURCES } from "@/lib/media-monitor/content";

export function MediaMonitorSourcesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {MEDIA_MONITOR_SOURCES.map((source) => (
        <div
          key={source.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h3 className="font-semibold text-slate-900">{source.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {source.description}
          </p>
        </div>
      ))}
    </div>
  );
}
