import { format } from "date-fns";
import { engagementRate } from "@/lib/metrics";
import type { Platform, PostInsights, SocialPost, StoryBeat } from "@/lib/types";

interface ContentSignals {
  sportsMetaphor: boolean;
  oneSave: boolean;
  pressRelease: boolean;
  patientStory: boolean;
  congress: boolean;
  sponsored: boolean;
  hashtagHeavy: boolean;
  dataDrop: boolean;
  awarenessDay: boolean;
  teamCulture: boolean;
  policyAccess: boolean;
  videoContent: boolean;
  launchDate: string | null;
}

interface InsightContext {
  channelAvgEngagement: number;
  channelAvgShareRatio: number;
  channelAvgCommentRatio: number;
  chronologicalRank: number;
  totalOnPlatform: number;
  precedingBeat?: StoryBeat;
  followingBeat?: StoryBeat;
}

function reactionTotal(post: SocialPost): number {
  return Math.max(post.metrics.likes, 1);
}

function shareRatio(post: SocialPost): number {
  return (post.metrics.shares / reactionTotal(post)) * 100;
}

function commentRatio(post: SocialPost): number {
  return (post.metrics.comments / reactionTotal(post)) * 100;
}

function detectSignals(caption: string): ContentSignals {
  const launchMatch = caption.match(
    /\b(\d{2}\.\d{2}\.\d{2,4})\b|(\b(?:may|june|july|august|september|october|november|december)\s+\d{1,2}(?:,?\s+\d{4})?)/i
  );

  return {
    sportsMetaphor:
      /goalkeeper|tournament|tim howard|world cup|one save|save changes|on the field/i.test(
        caption
      ),
    oneSave: /one save|save changes everything/i.test(caption),
    pressRelease:
      /#newsfor|#investors|press release|financial results|ir\.beonemedicines/i.test(
        caption
      ),
    patientStory:
      /patient story|richard|caregiver|advocacy council|you have cancer|living with/i.test(
        caption
      ),
    congress: /#asco|#eha|booth|fromfloortofeed|congress/i.test(caption),
    sponsored: /#sponsored|paid partnership/i.test(caption),
    hashtagHeavy: (caption.match(/#\w+/g) ?? []).length >= 5,
    dataDrop:
      /phase 3|78-month|long-term data|fda|approval|clinical trial|nejm/i.test(
        caption
      ),
    awarenessDay: /awareness day|awareness month|world day/i.test(caption),
    teamCulture: /#teambeone|meet \w+|general manager|great place to work/i.test(
      caption
    ),
    policyAccess: /access barrier|step therapy|insurance|cll care journey/i.test(
      caption
    ),
    videoContent: /0:\d{2}|reel|video|hear from/i.test(caption),
    launchDate: launchMatch?.[0] ?? null,
  };
}

function buildContext(posts: SocialPost[], post: SocialPost): InsightContext {
  const platformPosts = posts
    .filter((p) => p.platform === post.platform)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  const avgEngagement =
    platformPosts.reduce((sum, p) => sum + engagementRate(p.metrics), 0) /
    (platformPosts.length || 1);

  const avgShare =
    platformPosts.reduce((sum, p) => sum + shareRatio(p), 0) /
    (platformPosts.length || 1);

  const avgComment =
    platformPosts.reduce((sum, p) => sum + commentRatio(p), 0) /
    (platformPosts.length || 1);

  const rank = platformPosts.findIndex((p) => p.id === post.id);
  const precedingBeat = platformPosts[rank - 1]?.storyBeat;
  const followingBeat = platformPosts[rank + 1]?.storyBeat;

  return {
    channelAvgEngagement: avgEngagement,
    channelAvgShareRatio: avgShare,
    channelAvgCommentRatio: avgComment,
    chronologicalRank: rank,
    totalOnPlatform: platformPosts.length,
    precedingBeat,
    followingBeat,
  };
}

function buildWhatWorked(
  post: SocialPost,
  signals: ContentSignals,
  ctx: InsightContext
): string {
  const er = engagementRate(post.metrics);
  const shares = shareRatio(post);
  const comments = commentRatio(post);
  const parts: string[] = [];

  if (shares >= 15 || shares >= ctx.channelAvgShareRatio * 1.8) {
    parts.push(
      `High repost-to-reaction ratio (${shares.toFixed(0)}%) signals industry curiosity and shareability.`
    );
  }

  if (signals.sportsMetaphor || signals.oneSave) {
    parts.push(
      "The sports metaphor (goalkeeper save = clinical save) lands without explaining the medicine, which keeps it accessible to non-scientific audiences."
    );
  }

  if (signals.patientStory) {
    parts.push(
      "Patient-centered framing invites empathy and gives the brand a human voice beyond corporate broadcast."
    );
  }

  if (signals.dataDrop && er >= ctx.channelAvgEngagement) {
    parts.push(
      "Clinical data and regulatory milestones give the post credibility with HCP and investor audiences who reward evidence over promotion."
    );
  }

  if (signals.congress && post.metrics.reach > 0) {
    parts.push(
      "Congress-timed content rides real-world news cycles, making the post feel timely rather than evergreen filler."
    );
  }

  if (comments >= 8 || comments >= ctx.channelAvgCommentRatio * 2) {
    parts.push(
      `Strong comment-to-reaction ratio (${comments.toFixed(1)}%) suggests the audience is responding, not just scrolling past.`
    );
  } else if (er >= ctx.channelAvgEngagement * 1.25) {
    parts.push(
      `Engagement rate (${er.toFixed(1)}%) outperforms the ${post.platform} channel average, indicating the creative and message resonated.`
    );
  }

  if (signals.teamCulture) {
    parts.push(
      "People-and-culture storytelling builds employer brand affinity and softens the corporate pharma tone."
    );
  }

  if (signals.policyAccess) {
    parts.push(
      "Policy and access framing positions BeOne as a systems-level advocate, not just a product marketer."
    );
  }

  if (parts.length === 0) {
    parts.push(
      `${post.storyBeat} content on ${post.platform} met baseline performance expectations and reinforced the channel's core narrative themes.`
    );
  }

  return parts.slice(0, 2).join(" ");
}

function buildWhatDiluted(
  post: SocialPost,
  signals: ContentSignals,
  ctx: InsightContext
): string {
  const comments = commentRatio(post);
  const likes = post.metrics.likes;
  const parts: string[] = [];

  if (comments < 2 && likes >= 50) {
    parts.push(
      `${post.metrics.comments === 0 ? "No" : `Only ${post.metrics.comments}`} comment${post.metrics.comments === 1 ? "" : "s"} for ${likes} reactions suggests passive viewership, not active engagement.`
    );
  }

  if (signals.pressRelease) {
    parts.push(
      "Press-release tone (#Newsfor #Investors) reads as broadcast, which limits comment velocity and personal connection."
    );
  }

  if (signals.sponsored) {
    parts.push(
      "The #Sponsored label can dampen organic trust — audiences may treat the message as paid reach rather than earned conviction."
    );
  }

  if (signals.hashtagHeavy) {
    parts.push(
      "Hashtag density competes with the core message and can make the post feel optimized for algorithms over readability."
    );
  }

  if (signals.launchDate) {
    parts.push(
      `The ${signals.launchDate} date stamp creates artificial urgency that becomes a liability if the launch underdelivers on the promise.`
    );
  }

  if (
    shareRatio(post) < ctx.channelAvgShareRatio * 0.4 &&
    post.metrics.likes > 20
  ) {
    parts.push(
      "Low share rate despite solid reactions means the content resonated privately but did not travel beyond the immediate audience."
    );
  }

  if (post.caption.length > 600 && !signals.patientStory) {
    parts.push(
      "Length works against mobile scan behavior — the key insight may be buried below the fold."
    );
  }

  if (parts.length === 0) {
    const er = engagementRate(post.metrics);
    if (er < ctx.channelAvgEngagement * 0.75) {
      parts.push(
        `Below-average engagement (${er.toFixed(1)}% ER) suggests the creative or copy did not break through on ${post.platform}.`
      );
    } else {
      parts.push(
        "No major dilution signals — performance is consistent with channel norms, though there is room to drive more conversation."
      );
    }
  }

  return parts.slice(0, 2).join(" ");
}

function buildNarrativeRole(
  post: SocialPost,
  signals: ContentSignals,
  ctx: InsightContext
): string {
  const dateLabel = format(new Date(post.publishedAt), "MM.dd.yy");
  const beat = post.storyBeat;

  if (signals.oneSave || signals.sportsMetaphor) {
    return `Opens a new chapter in BeOne's story arc. Sets up an explicit "before/after" anchor moment around ${signals.launchDate ?? dateLabel}. The metaphor commits the brand to delivering something that earns the comparison.`;
  }

  if (signals.patientStory) {
    return `Humanizes the ${beat.toLowerCase()} thread with lived experience. Acts as an emotional counterweight to data-heavy posts${ctx.precedingBeat ? ` that preceded it (${ctx.precedingBeat})` : ""}, keeping the narrative from feeling purely corporate.`;
  }

  if (signals.congress && signals.dataDrop) {
    return `Validates scientific credibility during an active congress window. Anchors the ${beat} beat with evidence that stakeholders can cite after the event cycle ends.`;
  }

  if (signals.pressRelease) {
    return `Fulfills the investor-and-media lane of the narrative — less about community engagement, more about signaling material news to markets and press.`;
  }

  if (signals.policyAccess) {
    return `Extends the story from science to systems — arguing that innovation only matters if patients can access it. Bridges ${beat} content to policy advocacy.`;
  }

  if (signals.awarenessDay) {
    return `Participates in a shared cultural moment (awareness day) to stay visible in disease communities without leading with product claims.`;
  }

  if (signals.teamCulture) {
    return `Reinforces the "People & Culture" dimension of the arc — showing who carries the mission, not just what the company ships.`;
  }

  if (ctx.chronologicalRank === 0) {
    return `Leads the current ${post.platform} narrative — the most recent expression of ${beat}, setting the tone for what follows.`;
  }

  if (ctx.chronologicalRank >= ctx.totalOnPlatform - 3) {
    return `Closes an earlier chapter on ${post.platform}. ${beat} content that established themes the channel has since evolved past.`;
  }

  if (ctx.followingBeat && ctx.followingBeat !== beat) {
    return `Transitions the arc from ${ctx.followingBeat} toward ${beat} — a pivot point in how BeOne is telling its story on ${post.platform}.`;
  }

  return `Sustains the ${beat} beat on ${post.platform} — not a pivot, but a reinforcement that keeps the through-line visible between bigger narrative moments.`;
}

export function analyzePostInsights(
  post: SocialPost,
  allPosts: SocialPost[]
): PostInsights {
  const signals = detectSignals(post.caption);
  const ctx = buildContext(allPosts, post);

  return {
    whatWorked: buildWhatWorked(post, signals, ctx),
    whatDiluted: buildWhatDiluted(post, signals, ctx),
    narrativeRole: buildNarrativeRole(post, signals, ctx),
  };
}

export function enrichPostsWithInsights(posts: SocialPost[]): SocialPost[] {
  return posts.map((post) => ({
    ...post,
    insights: analyzePostInsights(post, posts),
  }));
}
