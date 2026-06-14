import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { VOICE_TRAINING_PRODUCT_NAME } from "@/lib/voice-training/content";
import { VoiceTrainingSubnav } from "./VoiceTrainingSubnav";

interface VoiceTrainingPageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function VoiceTrainingPageShell({
  title,
  subtitle,
  children,
}: VoiceTrainingPageShellProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <VoiceTrainingSubnav />
      <div className="space-y-8 p-8">{children}</div>
    </>
  );
}

export function VoiceTrainingHero() {
  return (
    <div className="rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white">
          <Mic className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {VOICE_TRAINING_PRODUCT_NAME}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Learns each executive&apos;s writing voice from their past posts.
            Drafts new content in their actual voice — so the ghostwritten-by-comms
            tone disconnect dies.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/voice-training/train"
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
            >
              Train a profile
            </Link>
            <Link
              href="/voice-training/draft"
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
            >
              Draft in voice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SubPageLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-rose-200 hover:bg-rose-50/30"
    >
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-rose-700">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-rose-600" />
    </Link>
  );
}
