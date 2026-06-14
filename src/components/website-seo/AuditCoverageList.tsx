import { CheckCircle2 } from "lucide-react";
import { AUDIT_COVERAGE_AREAS } from "@/lib/website-seo/content";

export function AuditCoverageList() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {AUDIT_COVERAGE_AREAS.map((area) => (
        <li
          key={area}
          className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
          {area}
        </li>
      ))}
    </ul>
  );
}
