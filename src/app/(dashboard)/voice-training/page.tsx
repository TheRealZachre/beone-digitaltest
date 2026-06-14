import {
  SubPageLink,
  VoiceTrainingHero,
  VoiceTrainingPageShell,
} from "@/components/voice-training/VoiceTrainingPageShell";
import {
  VOICE_TRAINING_OVERVIEW,
  VOICE_TRAINING_PRODUCT_NAME,
  VOICE_TRAINING_STEPS,
  VOICE_TRAINING_TAGLINE,
} from "@/lib/voice-training/content";

export default function VoiceTrainingOverviewPage() {
  return (
    <VoiceTrainingPageShell
      title={VOICE_TRAINING_PRODUCT_NAME}
      subtitle={VOICE_TRAINING_TAGLINE}
    >
      <VoiceTrainingHero />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {VOICE_TRAINING_OVERVIEW}
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">How it works</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {VOICE_TRAINING_STEPS.map((step) => (
            <div
              key={step.step}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-700">
                {step.step}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <SubPageLink
          href="/voice-training/train"
          title="Train Profile"
          description="Learn voice signatures from an executive's past LinkedIn and X posts."
        />
        <SubPageLink
          href="/voice-training/draft"
          title="Draft in Voice"
          description="Generate LinkedIn posts, articles, or X copy in the executive's actual voice."
        />
      </section>
    </VoiceTrainingPageShell>
  );
}
