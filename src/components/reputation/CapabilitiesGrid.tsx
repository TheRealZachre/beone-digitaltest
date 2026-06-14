import { REPUTATION_CAPABILITIES } from "@/lib/reputation/content";

export function ReputationCapabilitiesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {REPUTATION_CAPABILITIES.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h3 className="font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
