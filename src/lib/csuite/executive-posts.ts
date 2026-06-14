import { subDays } from "date-fns";
import type { StoryBeat } from "@/lib/types";
import type { ExecutivePublishedPost } from "./types";

const now = new Date();

function daysAgo(n: number): string {
  return subDays(now, n).toISOString();
}

const SAMPLE_CONTENT: {
  executiveId: string;
  executiveName: string;
  storyBeat: StoryBeat;
  snippet: string;
}[] = [
  {
    executiveId: "oyler",
    executiveName: "John V. Oyler",
    storyBeat: "Brand Vision",
    snippet:
      "Strong first-quarter results reinforce BeOne's growth as a global oncology leader. Corporate momentum only matters when it translates to patient impact — here's how I read our latest chapter...",
  },
  {
    executiveId: "oyler",
    executiveName: "John V. Oyler",
    storyBeat: "Policy Advocacy",
    snippet:
      "Access policy is not a back-office issue — it's a clinical outcomes issue. My perspective for policymakers on expanding global access to oncology medicines...",
  },
  {
    executiveId: "mark-lanasa",
    executiveName: "Mark Lanasa, M.D., Ph.D.",
    storyBeat: "Scientific Innovation",
    snippet:
      "At ASCO, our solid tumor pipeline spanning breast, lung, and GI cancers reflects speed and purpose in disease areas where new options are urgently needed...",
  },
  {
    executiveId: "mark-lanasa",
    executiveName: "Mark Lanasa, M.D., Ph.D.",
    storyBeat: "Patient-Centered",
    snippet:
      "Progress in solid tumors isn't just about response rates — it's about what patients and clinicians can expect over time. A clinical leader's reflection...",
  },
  {
    executiveId: "amit-agarwal",
    executiveName: "Amit Agarwal, M.D., Ph.D.",
    storyBeat: "Scientific Innovation",
    snippet:
      "Long-term evidence stole the spotlight in CLL this year. With 78-month follow-up data, we're redefining what durability means for patients and treating physicians...",
  },
  {
    executiveId: "amit-agarwal",
    executiveName: "Amit Agarwal, M.D., Ph.D.",
    storyBeat: "Disease Awareness",
    snippet:
      "For patients with relapsed or refractory mantle cell lymphoma, options are limited. Here's why long-term hematology innovation must keep raising the bar...",
  },
  {
    executiveId: "lai-wang",
    executiveName: "Lai Wang, Ph.D.",
    storyBeat: "Scientific Innovation",
    snippet:
      "Pipeline momentum across hematology and solid tumors starts with rigorous science and disciplined development. Behind our latest R&D narrative...",
  },
  {
    executiveId: "lai-wang",
    executiveName: "Lai Wang, Ph.D.",
    storyBeat: "Corporate Citizenship",
    snippet:
      "Innovation and access must travel together. How BeOne's R&D strategy connects scientific progress to patients who need it most...",
  },
  {
    executiveId: "oyler",
    executiveName: "John V. Oyler",
    storyBeat: "Patient-Centered",
    snippet:
      "Patients First is not a slogan — it's the filter for every strategic decision we make. Listening to patient stories changed how I prioritize this quarter...",
  },
  {
    executiveId: "xiaobin-wu",
    executiveName: "Xiaobin Wu, Ph.D.",
    storyBeat: "People & Culture",
    snippet:
      "Our teams carry the mission of making oncology medicines accessible to more people worldwide. Execution at scale starts with people who believe in the work...",
  },
  {
    executiveId: "xiaobin-wu",
    executiveName: "Xiaobin Wu, Ph.D.",
    storyBeat: "Brand Vision",
    snippet:
      "Together, we are how the world stops cancer. Operational excellence is how we turn that purpose into medicines that reach patients globally...",
  },
  {
    executiveId: "amit-agarwal",
    executiveName: "Amit Agarwal, M.D., Ph.D.",
    storyBeat: "Patient-Centered",
    snippet:
      "Evidence and empathy must travel together in hematology. What durable CLL data means for treatment decisions clinicians make every day...",
  },
];

function makeMetrics(seed: number) {
  const impressions = 12000 + seed * 3400;
  const likes = Math.floor(impressions * (0.025 + (seed % 5) * 0.004));
  const comments = Math.floor(likes * 0.12);
  const shares = Math.floor(likes * 0.08);
  const reach = Math.floor(impressions * 0.82);
  const engagements = likes + comments + shares;
  const engagementRate = (engagements / reach) * 100;

  return {
    impressions,
    engagementRate: Math.round(engagementRate * 10) / 10,
    followerGrowth: 40 + seed * 18,
    likes,
    comments,
    shares,
  };
}

export const EXECUTIVE_PUBLISHED_POSTS: ExecutivePublishedPost[] =
  SAMPLE_CONTENT.map((item, index) => ({
    id: `exec-post-${index + 1}`,
    executiveId: item.executiveId,
    executiveName: item.executiveName,
    platform: index % 4 === 0 ? "x" : "linkedin",
    contentType: index % 5 === 0 ? "article" : "post",
    publishedAt: daysAgo(3 + index * 3),
    storyBeat: item.storyBeat,
    content: item.snippet,
    metrics: makeMetrics(index + 1),
  }));

export function getExecutivePostsForDays(days: number): ExecutivePublishedPost[] {
  const cutoff = subDays(now, days);
  return EXECUTIVE_PUBLISHED_POSTS.filter(
    (p) => new Date(p.publishedAt) >= cutoff
  );
}
