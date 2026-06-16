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
      `High repost-to-reaction ratio (${shares.toFixed(0)}% vs channel avg ${ctx.channelAvgShareRatio.toFixed(0)}%) shows this post traveled well beyond the immediate audience — a strong signal of shareability. → Repeat this: open future posts with a concrete outcome stat or a provocative data point in the first line to trigger the same distribution behavior.`
    );
  }

  if (signals.sportsMetaphor || signals.oneSave) {
    parts.push(
      `The sports metaphor (goalkeeper save = clinical save) made a complex oncology concept immediately accessible to non-scientific audiences without dumbing it down. → Repeat this: continue using universal human experiences (sport, family, milestone moments) as entry points for difficult clinical narratives — it broadens reach while keeping the science credible.`
    );
  }

  if (signals.patientStory) {
    parts.push(
      `Patient-centered framing gave the brand a human voice that cuts through corporate broadcast noise. Real lived experience content consistently earns higher comment rates because it invites empathy, not passive reading. → Repeat this: anchor at least one post per month to a patient or caregiver perspective — even a single quote works. This is the most reliable driver of meaningful comment volume.`
    );
  }

  if (signals.dataDrop && er >= ctx.channelAvgEngagement) {
    parts.push(
      `Clinical data and regulatory milestones delivered above-average engagement (${er.toFixed(1)}% ER), confirming that HCP and investor audiences on ${post.platform} reward evidence over promotion. → Repeat this: pair every data drop with one plain-language sentence explaining what the number means for patients — this bridges scientific and general audiences in a single post.`
    );
  }

  if (signals.congress && post.metrics.reach > 0) {
    parts.push(
      `Congress-timed content rode an active news cycle, making the post feel timely rather than evergreen filler — audiences already scanning for ASCO/EHA updates were primed to engage. → Repeat this: pre-schedule at least three posts per congress window (preview, day-of, recap) to capture the full engagement arc rather than a single spike.`
    );
  }

  if (comments >= 8 || comments >= ctx.channelAvgCommentRatio * 2) {
    parts.push(
      `Strong comment-to-reaction ratio (${comments.toFixed(1)}% vs channel avg ${ctx.channelAvgCommentRatio.toFixed(1)}%) shows the audience responded actively, not just scrolled past. Comment volume amplifies organic reach on ${post.platform}'s algorithm. → Repeat this: close with a direct question or a genuine invitation to share an experience — even one extra sentence triggers significantly more comments.`
    );
  } else if (er >= ctx.channelAvgEngagement * 1.25) {
    parts.push(
      `Engagement rate of ${er.toFixed(1)}% outperformed the ${post.platform} channel average (${ctx.channelAvgEngagement.toFixed(1)}%) by ${((er / ctx.channelAvgEngagement - 1) * 100).toFixed(0)}% — the creative format and message combination resonated with this audience. → Repeat this: analyze the post format (image vs video vs carousel, caption length, opening hook) and replicate the structural pattern in future ${post.storyBeat} content.`
    );
  }

  if (signals.teamCulture) {
    parts.push(
      `People-and-culture storytelling built employer brand affinity while softening the corporate pharma tone — a combination that earns both high engagement and positive brand sentiment. → Repeat this: feature a different team member or internal milestone each month to sustain momentum; consistent people content compounds over time into a recognizable culture narrative.`
    );
  }

  if (signals.policyAccess) {
    parts.push(
      `Policy and access framing positioned BeOne as a systems-level advocate rather than a product marketer, which tends to attract shares from patient advocacy organizations and policymakers — a valuable secondary audience. → Repeat this: connect each policy post to a specific patient impact (e.g., "X patients face this barrier") to make the systemic argument feel personal and urgent.`
    );
  }

  if (parts.length === 0) {
    parts.push(
      `${post.storyBeat} content on ${post.platform} met baseline performance expectations (${er.toFixed(1)}% ER vs channel avg ${ctx.channelAvgEngagement.toFixed(1)}%), confirming the narrative theme is resonating at a steady level. → To build on this: test a different content format for the next ${post.storyBeat} post (e.g., swap a static image for a short video or a carousel) to see whether the theme can unlock higher engagement with a fresh creative treatment.`
    );
  }

  return parts.slice(0, 2).join("\n\n");
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
      `${post.metrics.comments === 0 ? "No" : `Only ${post.metrics.comments}`} comment${post.metrics.comments === 1 ? "" : "s"} for ${likes} reactions points to passive viewership — the audience liked it but didn't feel compelled to respond. This is a missed amplification opportunity since comments significantly boost ${post.platform} algorithmic reach. → To fix: rewrite the closing line of the next similar post as a direct question or a "share your experience" prompt. Even a single question at the end reliably increases comment volume by 2–4×.`
    );
  }

  if (signals.pressRelease) {
    parts.push(
      `Press-release framing (#Newsfor, #Investors) reads as a broadcast to markets and media — it limits personal connection and suppresses comment velocity because the audience doesn't see an entry point to respond. → To fix: split investor-facing news into two posts: one formal announcement for the IR audience, and a separate human-language version ("here's what this approval means for patients") aimed at the broader ${post.platform} community. The second post will consistently outperform the first.`
    );
  }

  if (signals.sponsored) {
    parts.push(
      `The #Sponsored label signals paid reach, which reduces organic trust — audiences filter sponsored content differently and are less likely to share or comment on it. → To fix: where possible, convert sponsored messages into organic posts driven by owned story (patient voice, scientific milestone, employee perspective). Reserve the #Sponsored tag for regulatory-required disclosures only, not routine branded content.`
    );
  }

  if (signals.hashtagHeavy) {
    parts.push(
      `High hashtag density (5+ tags) competes with the core message and makes the post feel keyword-optimized rather than written for a human reader. On LinkedIn in particular, hashtag clutter is associated with lower engagement rates. → To fix: cap hashtags at 2–3 per post, choosing only the most specific and relevant. Redirect the copy space toward a sharper headline or a concrete takeaway.`
    );
  }

  if (signals.launchDate) {
    parts.push(
      `The explicit ${signals.launchDate} date stamp creates urgency that becomes a liability once the date passes — the post ages quickly and can feel outdated in a feed. → To fix: use event framing ("at ASCO this week") rather than hard date stamps for congress content, and save specific dates only for regulatory milestones where the date is the news (FDA approval, PDUFA date).`
    );
  }

  if (
    shareRatio(post) < ctx.channelAvgShareRatio * 0.4 &&
    post.metrics.likes > 20
  ) {
    parts.push(
      `Low share rate (${shareRatio(post).toFixed(1)}% vs channel avg ${ctx.channelAvgShareRatio.toFixed(1)}%) despite solid reactions means the content resonated privately but did not travel — the audience processed it internally rather than forwarding it. This limits organic reach expansion. → To fix: make the next similar post explicitly "worth sharing" by including a surprising stat, a quotable line, or an insight that makes the reader feel smarter for having shared it.`
    );
  }

  if (post.caption.length > 600 && !signals.patientStory) {
    parts.push(
      `Caption length (${post.caption.length} characters) works against mobile scan behavior — the key insight is likely buried below the fold, and most readers won't reach it. → To fix: lead with the single most important sentence in the first line (the hook), then follow with detail. For non-patient-story content, aim for 300 characters or fewer above the "see more" cut, with supporting copy below.`
    );
  }

  if (parts.length === 0) {
    const er = engagementRate(post.metrics);
    if (er < ctx.channelAvgEngagement * 0.75) {
      parts.push(
        `Below-average engagement (${er.toFixed(1)}% ER vs channel avg ${ctx.channelAvgEngagement.toFixed(1)}%) suggests the creative or copy did not break through on ${post.platform} this cycle. The topic may be right but the format or hook needs rethinking. → To fix: A/B test the same underlying message with a different opening line — replacing a corporate statement opener with a question, a stat, or a patient-facing claim typically lifts engagement by 20–40%.`
      );
    } else {
      parts.push(
        `No major dilution signals detected — performance is consistent with channel norms. The post is doing its job, though there is headroom to drive more conversation. → To improve: add a specific call-to-action in the next similar post ("What question would you ask?", "Tag a colleague who should see this") to convert passive readers into active participants.`
      );
    }
  }

  return parts.slice(0, 2).join("\n\n");
}

function buildNarrativeRole(
  post: SocialPost,
  signals: ContentSignals,
  ctx: InsightContext
): string {
  const dateLabel = format(new Date(post.publishedAt), "MM.dd.yy");
  const beat = post.storyBeat;

  if (signals.oneSave || signals.sportsMetaphor) {
    return `This post opens a new chapter in BeOne's story arc — the "One Save Changes Everything" metaphor sets an explicit before/after anchor moment around ${signals.launchDate ?? dateLabel}. It commits the brand to a narrative promise: something tangible must be delivered to earn the comparison, which raises the stakes for all subsequent ${beat} content. → Next step: follow this anchor post with a concrete proof point (a patient outcome, a data milestone, or a real-world access story) within 2–3 weeks to close the narrative loop and validate the metaphor.`;
  }

  if (signals.patientStory) {
    return `This post humanizes the ${beat.toLowerCase()} thread with lived experience, acting as an essential emotional counterweight to data-heavy content${ctx.precedingBeat ? ` like the preceding ${ctx.precedingBeat} post` : ""}. Without posts like this one, the channel risks feeling like a press wire — all signal, no soul. Patient stories are also the most likely content type to be shared by disease advocacy communities, extending organic reach to audiences BeOne cannot buy. → Next step: establish a regular cadence of one patient or caregiver perspective post per month. Build a content library of patient voice (quotes, video clips, written stories) so the narrative doesn't dry up between clinical milestones.`;
  }

  if (signals.congress && signals.dataDrop) {
    return `This post validates scientific credibility during an active congress window, anchoring the ${beat} beat with peer-reviewed evidence that stakeholders can cite long after the event cycle ends. Congress content has a longer shelf life than most — it becomes a reference point in follow-up conversations with HCPs, investors, and media. → Next step: repurpose this post's key data point into 2–3 follow-up content pieces: a visual summary, a patient-impact interpretation, and a long-form explainer. Extend the congress moment into a multi-week narrative thread rather than a single spike.`;
  }

  if (signals.pressRelease) {
    return `This post fulfills the investor-and-media lane of the narrative — it signals material news to markets and press rather than building community engagement. This is a necessary but low-resonance content type; it performs a compliance function more than a brand-building one. → Next step: for every press-release post, create a companion "what this means for patients" post within 24 hours. The companion post takes the same news and makes it personally relevant, capturing the engagement the formal announcement misses.`;
  }

  if (signals.policyAccess) {
    return `This post extends BeOne's story from science to systems — it argues that innovation only matters if patients can actually access it, bridging ${beat} content to policy advocacy. This positioning is rare in pharma social and tends to attract shares from patient advocacy groups, rare disease communities, and healthcare policy influencers who don't typically engage with product content. → Next step: build on this framing by profiling a specific patient affected by an access barrier, then following up with BeOne's concrete response to that challenge. The story arc (problem → BeOne action → patient outcome) creates a three-post narrative that sustains engagement over several weeks.`;
  }

  if (signals.awarenessDay) {
    return `This post participates in a shared cultural moment (awareness day / awareness month) to keep BeOne visible in disease communities without leading with product claims — a credibility-building move that often outperforms direct brand posts in organic reach. → Next step: plan awareness day content at least 30 days in advance so it can incorporate patient voices, visual assets, and a clear call to action (a resource link, a hashtag to follow) rather than a last-minute text post. Awareness day posts with patient-voice elements consistently outperform generic "we support X awareness" content.`;
  }

  if (signals.teamCulture) {
    return `This post reinforces the "People & Culture" dimension of BeOne's arc — it shows who carries the mission, not just what the company ships. Culture content is a proven talent magnet and brand softener; it signals organizational health to investors and prospective employees simultaneously. → Next step: profile team members across different functions (R&D, patient access, regulatory, clinical ops) rather than concentrating on leadership. Depth-of-org culture content feels more authentic and reaches a wider internal-referral network when employees share it.`;
  }

  if (ctx.chronologicalRank === 0) {
    return `This is the most recent expression of ${beat} on ${post.platform}, setting the current tone for everything that follows. It effectively defines the "state of the narrative" for anyone landing on the profile today. → Next step: assess whether this leading post represents the message BeOne most wants to lead with right now. If a more strategically important beat (e.g., a clinical milestone) should be the first thing the audience sees, consider whether a higher-priority post should come next.`;
  }

  if (ctx.chronologicalRank >= ctx.totalOnPlatform - 3) {
    return `This is an early-chapter post on ${post.platform} — ${beat} content that helped establish themes the channel has since built upon. Its narrative function has largely been fulfilled, but it remains part of the brand's content heritage. → Next step: review whether this older content is still aligned with current messaging. If the framing or data is outdated, consider a direct update post that references the evolution: "Since we shared this, here's what's changed" — a format that performs well because it rewards returning audiences.`;
  }

  if (ctx.followingBeat && ctx.followingBeat !== beat) {
    return `This post sits at a pivot point in the ${post.platform} arc — transitioning from ${ctx.followingBeat} content toward ${beat}, which signals a deliberate (or accidental) shift in narrative emphasis. Pivot posts are high-stakes because they set audience expectations for what comes next. → Next step: make the next 2–3 posts consistently ${beat} to confirm the pivot is intentional. Inconsistent beat transitions signal reactive posting rather than a managed content strategy, which erodes audience trust in the narrative.`;
  }

  return `This post sustains the ${beat} beat on ${post.platform} — not a pivot, but a necessary reinforcement that keeps the through-line visible between bigger narrative moments. Consistent beat repetition builds audience recognition: over time, followers associate BeOne with this theme. → Next step: vary the format within this beat (try a question-led post, a stat-first post, and a story-led post) to sustain engagement without changing the narrative direction. Format variety within a consistent beat is the most efficient lever for keeping a content theme fresh.`;
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
