import { CORE_CAPABILITIES } from "@/lib/youtube/content";
import {
  Bot,
  Gauge,
  Link2,
  LineChart,
  type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  integration: Link2,
  scoring: Gauge,
  automation: Bot,
  intelligence: LineChart,
};

export function CapabilityGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {CORE_CAPABILITIES.map((cap) => {
        const Icon = categoryIcons[cap.category] ?? Gauge;
        return (
          <div
            key={cap.label}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium text-slate-800">{cap.label}</p>
          </div>
        );
      })}
    </div>
  );
}
