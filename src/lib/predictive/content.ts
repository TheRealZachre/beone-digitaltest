export const PREDICTIVE_PRODUCT_NAME = "Predictive Performance";
export const PREDICTIVE_TAGLINE =
  "Draft a post, get predicted impressions and engagement before publishing";

export const PREDICTIVE_OVERVIEW =
  "Stop guessing before you hit publish. Paste a draft and the system forecasts impressions, reach, and engagement using your channel's historical performance — then returns three optimized variants ranked by predicted lift.";

export const PREDICTIVE_CAPABILITIES = [
  {
    title: "Pre-publish forecasting",
    description:
      "Predicts impressions, reach, total engagements, and engagement rate from your synced post history on the selected platform.",
  },
  {
    title: "Story beat & category context",
    description:
      "Infers narrative beat and content category from the draft, then tightens the baseline against similar posts in your corpus.",
  },
  {
    title: "Three optimized variants",
    description:
      "Hook-first, data-led, and engagement-optimized rewrites — each rescored and ranked by predicted lift vs your original draft.",
  },
  {
    title: "Transparent signals",
    description:
      "Surfaces which content signals drove the forecast: hook strength, data density, hashtags, questions, and structure.",
  },
] as const;
