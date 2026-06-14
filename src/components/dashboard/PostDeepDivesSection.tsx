import { selectDeepDivePosts, deepDivePostPool } from "@/lib/narrative/deep-dive";
import { rankByEngagement } from "@/lib/metrics";
import type { SocialPost } from "@/lib/types";
import { PostDeepDive } from "./PostDeepDive";

interface PostDeepDivesSectionProps {
  posts: SocialPost[];
  title?: string;
  subtitle?: string;
  recentDays?: number;
}

export function PostDeepDivesSection({
  posts,
  title = "Why these landed. Why these didn't.",
  subtitle = "Per-post analysis from the latest posts: what worked, what diluted, and the narrative role each played in the recent arc.",
  recentDays = 30,
}: PostDeepDivesSectionProps) {
  const pool = deepDivePostPool(posts, recentDays);
  const featured = selectDeepDivePosts(posts, 6, recentDays);
  const rankedPosts = rankByEngagement(pool);

  if (featured.length === 0) return null;

  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c8102e]">
        Top Performers · Underperformers
      </p>
      <h2 className="mt-2 font-serif text-2xl font-normal tracking-[-0.01em] text-[#0d1421] md:text-[28px]">
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4a5568]">
        {subtitle}
      </p>

      <div className="mt-5 space-y-[18px]">
        {featured.map((post) => (
          <PostDeepDive
            key={post.id}
            post={post}
            rankedPosts={rankedPosts}
          />
        ))}
      </div>
    </section>
  );
}
