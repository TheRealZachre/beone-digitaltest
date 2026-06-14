import { CheckCircle2, XCircle } from "lucide-react";

interface WhatWorkedAnalysisProps {
  worked: string[];
  didNot: string[];
}

export function WhatWorkedAnalysis({ worked, didNot }: WhatWorkedAnalysisProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <h3 className="text-base font-semibold text-emerald-900">
            What Worked
          </h3>
        </div>
        <ul className="mt-4 space-y-2">
          {worked.map((item, index) => (
            <li
              key={`worked-${index}`}
              className="flex items-start gap-2 text-sm text-emerald-800"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-6">
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-rose-600" />
          <h3 className="text-base font-semibold text-rose-900">
            What Did Not Work
          </h3>
        </div>
        <ul className="mt-4 space-y-2">
          {didNot.map((item, index) => (
            <li
              key={`did-not-${index}`}
              className="flex items-start gap-2 text-sm text-rose-800"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
