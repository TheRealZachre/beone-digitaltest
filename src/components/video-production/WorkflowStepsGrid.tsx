import { WORKFLOW_STEPS } from "@/lib/video-production/content";

export function WorkflowStepsGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {WORKFLOW_STEPS.map((step) => (
        <div
          key={step.id}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-100 text-sm font-semibold text-fuchsia-700">
              {step.step}
            </span>
            <h3 className="font-semibold text-slate-900">
              Step {step.step} — {step.title}
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
