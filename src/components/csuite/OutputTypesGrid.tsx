import { CONTENT_OUTPUT_TYPES } from "@/lib/csuite/content";

export function OutputTypesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {CONTENT_OUTPUT_TYPES.map((type) => (
        <div
          key={type.id}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h3 className="font-semibold text-slate-900">{type.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {type.description}
          </p>
        </div>
      ))}
    </div>
  );
}
