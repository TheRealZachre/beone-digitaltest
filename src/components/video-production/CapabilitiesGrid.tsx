import { KEY_CAPABILITIES } from "@/lib/video-production/content";
import {
  Calendar,
  Captions,
  Palette,
  Ratio,
  Sparkles,
  UserCircle,
} from "lucide-react";

const icons = [Palette, UserCircle, Captions, Ratio, Sparkles, Calendar];

export function CapabilitiesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {KEY_CAPABILITIES.map((capability, index) => {
        const Icon = icons[index] ?? Sparkles;
        return (
          <div
            key={capability}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fuchsia-100 text-fuchsia-700">
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              {capability}
            </p>
          </div>
        );
      })}
    </div>
  );
}
