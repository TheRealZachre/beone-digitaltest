import { HOW_IT_WORKS_STEPS } from "@/lib/csuite/content";

export function HowItWorksSteps() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {HOW_IT_WORKS_STEPS.map((step) => (
        <div
          key={step.step}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
            {step.step}
          </span>
          <h3 className="mt-3 font-semibold text-slate-900">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
