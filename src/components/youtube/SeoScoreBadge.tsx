import clsx from "clsx";

interface SeoScoreBadgeProps {
  score: number;
  size?: "sm" | "md";
}

function scoreColor(score: number) {
  if (score >= 75) return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (score >= 55) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-rose-100 text-rose-800 border-rose-200";
}

export function SeoScoreBadge({ score, size = "sm" }: SeoScoreBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border font-semibold",
        scoreColor(score),
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      SEO {score}
    </span>
  );
}
