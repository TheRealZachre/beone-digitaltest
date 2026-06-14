import { format, subDays } from "date-fns";
import type { StoryBeat } from "@/lib/types";
import {
  EXECUTIVE_PUBLISHED_POSTS,
  getExecutivePostsForDays,
} from "./executive-posts";
import { DEFAULT_EXECUTIVES } from "./executives";
import type {
  MonthlyExecutiveReport,
  QuarterlyExecutiveReport,
} from "./types";

export function buildMonthlyReport(): MonthlyExecutiveReport {
  const posts = getExecutivePostsForDays(30);
  const periodLabel = format(new Date(), "MMMM yyyy");

  const executives = DEFAULT_EXECUTIVES.map((exec) => {
    const execPosts = posts.filter((p) => p.executiveId === exec.id);
    const totalImpressions = execPosts.reduce(
      (sum, p) => sum + p.metrics.impressions,
      0
    );
    const avgEngagementRate =
      execPosts.reduce((sum, p) => sum + p.metrics.engagementRate, 0) /
      (execPosts.length || 1);
    const followerGrowth = execPosts.reduce(
      (sum, p) => sum + p.metrics.followerGrowth,
      0
    );

    return {
      id: exec.id,
      name: exec.name,
      postsPublished: execPosts.length,
      totalImpressions,
      avgEngagementRate: Math.round(avgEngagementRate * 10) / 10,
      followerGrowth,
    };
  });

  const topPerformers = [...posts]
    .sort((a, b) => b.metrics.engagementRate - a.metrics.engagementRate)
    .slice(0, 5);

  return {
    timeframe: "monthly",
    periodLabel,
    executives,
    posts,
    topPerformers,
  };
}

export function buildQuarterlyReport(): QuarterlyExecutiveReport {
  const posts = getExecutivePostsForDays(90);
  const periodLabel = `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${format(new Date(), "yyyy")}`;

  const totalImpressions = posts.reduce(
    (sum, p) => sum + p.metrics.impressions,
    0
  );
  const priorImpressions = Math.round(totalImpressions * 0.86);
  const reachGrowthPercent =
    Math.round(((totalImpressions - priorImpressions) / priorImpressions) * 1000) / 10;

  const avgEngagement =
    posts.reduce((sum, p) => sum + p.metrics.engagementRate, 0) /
    (posts.length || 1);
  const industryAvg = 2.4;
  const engagementVsPeers =
    Math.round((avgEngagement / industryAvg) * 100) / 100;

  const beatMap = new Map<
    StoryBeat,
    { count: number; totalEr: number }
  >();
  for (const post of posts) {
    const entry = beatMap.get(post.storyBeat) ?? { count: 0, totalEr: 0 };
    entry.count += 1;
    entry.totalEr += post.metrics.engagementRate;
    beatMap.set(post.storyBeat, entry);
  }

  const categoryPerformance = [...beatMap.entries()].map(
    ([storyBeat, data]) => ({
      storyBeat,
      postCount: data.count,
      avgEngagementRate: Math.round((data.totalEr / data.count) * 10) / 10,
    })
  );

  const monthOverMonth = [0, 30, 60].map((offset) => {
    const start = subDays(new Date(), offset + 30);
    const end = subDays(new Date(), offset);
    const monthPosts = EXECUTIVE_PUBLISHED_POSTS.filter((p) => {
      const d = new Date(p.publishedAt);
      return d >= start && d < end;
    });
    const impressions = monthPosts.reduce(
      (sum, p) => sum + p.metrics.impressions,
      0
    );
    const er =
      monthPosts.reduce((sum, p) => sum + p.metrics.engagementRate, 0) /
      (monthPosts.length || 1);

    return {
      month: format(end, "MMM yyyy"),
      impressions,
      engagementRate: Math.round(er * 10) / 10,
    };
  }).reverse();

  return {
    timeframe: "quarterly",
    periodLabel,
    reachGrowthPercent,
    engagementVsPeers,
    categoryPerformance,
    monthOverMonth,
    peerBenchmark: [
      {
        label: "Avg engagement rate",
        value: Math.round(avgEngagement * 10) / 10,
        industryAvg,
      },
      {
        label: "Posts per executive",
        value: Math.round((posts.length / DEFAULT_EXECUTIVES.length) * 10) / 10,
        industryAvg: 2.1,
      },
      {
        label: "Impressions per post",
        value: Math.round(totalImpressions / (posts.length || 1)),
        industryAvg: 14500,
      },
    ],
  };
}
