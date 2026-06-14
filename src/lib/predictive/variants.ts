import type { Platform } from "@/lib/types";
import { analyzeContentSignals, liftPercent, predictMetrics } from "./score";
import type { PerformanceBaseline } from "./baseline";
import type { PostVariant, PredictedMetrics } from "./types";

function lines(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function ensureHashtag(caption: string, tag: string): string {
  if (caption.toLowerCase().includes(tag.toLowerCase())) return caption;
  return `${caption.trim()}\n\n${tag}`;
}

function hookFirstVariant(caption: string, platform: Platform): string {
  const parts = lines(caption);
  if (parts.length <= 1) {
    const sentences = caption.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length <= 1) return caption;
    const [hook, ...rest] = sentences;
    return [hook, "", ...rest].join("\n");
  }

  const [first, ...rest] = parts;
  const hook =
    first.length > 160 ? `${first.slice(0, 157).trim()}…` : first;
  return [hook, "", ...rest].join("\n");
}

function dataLedVariant(caption: string): string {
  const parts = lines(caption);
  const dataLine = parts.find((line) => /\d/.test(line));
  if (!dataLine) {
    return `${caption.trim()}\n\nKey takeaway: durable outcomes matter for patients waiting for options.`;
  }

  const rest = parts.filter((line) => line !== dataLine);
  return [dataLine, "", ...rest].join("\n");
}

function engagementVariant(caption: string, platform: Platform): string {
  let result = caption.trim();
  if (!/\?/.test(result)) {
    const question =
      platform === "linkedin"
        ? "What questions does this raise for your team?"
        : platform === "x"
          ? "What's your take?"
          : "What resonates with you?";
    result = `${result}\n\n${question}`;
  }

  if (!/learn more|link in|read more/i.test(result)) {
    result =
      platform === "instagram"
        ? `${result}\n\n🔗 Full story in bio.`
        : `${result}\n\nLearn more in the link.`;
  }

  return result;
}

interface VariantRecipe {
  id: string;
  label: string;
  strategy: string;
  build: (caption: string, platform: Platform) => string;
  optimizations: string[];
}

const RECIPES: VariantRecipe[] = [
  {
    id: "hook-first",
    label: "Hook-first",
    strategy: "Lead with the strongest line to stop the scroll.",
    build: hookFirstVariant,
    optimizations: [
      "Restructured opening line",
      "Added visual line break after hook",
      "Optimized first-line length for feed preview",
    ],
  },
  {
    id: "data-led",
    label: "Data-led",
    strategy: "Surface stats and proof points above the narrative fold.",
    build: dataLedVariant,
    optimizations: [
      "Moved data point to top",
      "Strengthened proof-first structure",
      "Improved credibility signal density",
    ],
  },
  {
    id: "engagement-optimized",
    label: "Engagement-optimized",
    strategy: "Add question and CTA to drive comments and clicks.",
    build: (caption, platform) => engagementVariant(caption, platform),
    optimizations: [
      "Added audience question",
      "Inserted clear CTA",
      "Tuned for comment and click velocity",
    ],
  },
];

export function buildOptimizedVariants(
  draftCaption: string,
  platform: Platform,
  baselineMetrics: PredictedMetrics,
  performanceBaseline: PerformanceBaseline
): PostVariant[] {
  const variants = RECIPES.map((recipe) => {
    let caption = recipe.build(draftCaption, platform);

    if (recipe.id === "hook-first" && platform === "linkedin") {
      caption = ensureHashtag(caption, "#oncology");
    }

    const signals = analyzeContentSignals(caption, platform);
    const predicted = predictMetrics(performanceBaseline, signals);

    return {
      id: recipe.id,
      label: recipe.label,
      strategy: recipe.strategy,
      caption,
      predicted,
      liftPercent: liftPercent(baselineMetrics, predicted),
      optimizations: recipe.optimizations,
    };
  });

  return variants.sort((a, b) => b.liftPercent - a.liftPercent);
}
