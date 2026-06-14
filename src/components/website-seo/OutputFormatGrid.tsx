import { AUDIT_OUTPUT_SECTIONS } from "@/lib/website-seo/content";

export function OutputFormatGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {AUDIT_OUTPUT_SECTIONS.map((section) => (
        <div
          key={section.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h3 className="font-semibold text-slate-900">{section.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {section.description}
          </p>
        </div>
      ))}
    </div>
  );
}
