import { subDays } from "date-fns";
import { inferStoryBeat } from "@/lib/narrative/beats";
import type { Platform, SocialPost } from "@/lib/types";

const now = new Date();

const SEED_BY_PLATFORM: Record<
  Exclude<Platform, "linkedin" | "tiktok">,
  { caption: string; category: SocialPost["category"] }[]
> = {
  instagram: [
    {
      caption:
        "One Save Changes Everything. Proud to stand with Tim Howard and #TeamBeOne at #ASCO26 — together, we are how the world stops cancer.",
      category: "behind-the-scenes",
    },
    {
      caption:
        "Patients First isn't just our value — it's how we show up every day. Swipe for Richard's esophageal cancer story. #BeOneAgainstCancer",
      category: "educational",
    },
    {
      caption:
        "78-month CLL data at ASCO — durability matters. Long-term outcomes are raising the bar for what patients and clinicians can expect.",
      category: "educational",
    },
    {
      caption:
        "Behind the scenes at #EHA2026 — connecting with the hematology community over Fika and bold science.",
      category: "behind-the-scenes",
    },
    {
      caption:
        "Solid tumor momentum: breast, lung, and GI progress shared at ASCO. New options where they're urgently needed.",
      category: "educational",
    },
    {
      caption:
        "Our 2025 Responsible Business & Sustainability Report is live. Advancing global health, empowering colleagues, innovating sustainably.",
      category: "educational",
    },
    {
      caption:
        "#EsophagealCancerAwarenessMonth — early detection saves lives. We're committed to awareness, research, and access.",
      category: "educational",
    },
    {
      caption:
        "Team BeOne across Thailand, Malaysia, and Singapore — our people carry the mission forward.",
      category: "behind-the-scenes",
    },
    {
      caption:
        "Q1 2026 results: sustained growth as a global oncology leader. Link in bio for the full release.",
      category: "promotional",
    },
    {
      caption:
        "Reel: What durable CLL data means for treating physicians — CMO Amit Agarwal, M.D., Ph.D. breaks it down.",
      category: "educational",
    },
    {
      caption:
        "Congress season is here. 60+ abstracts across ASCO and EHA — hematology leadership and solid tumor acceleration.",
      category: "promotional",
    },
    {
      caption:
        "Partnership spotlight: 293 patients supported through our work with The Max Foundation. Geography shouldn't determine survival.",
      category: "educational",
    },
  ],
  facebook: [
    {
      caption:
        "BeOne Medicines at ASCO 2026 — new data across hematology and solid tumors. Visit our booth and read the latest release.",
      category: "educational",
    },
    {
      caption:
        "When you hear 'you have cancer,' everything changes. Meet Richard's story — clarity, courage, and a path forward with his care team.",
      category: "educational",
    },
    {
      caption:
        "FDA Priority Review granted for our PD-1 inhibitor combination in HER2+ gastroesophageal adenocarcinoma. Read the announcement.",
      category: "promotional",
    },
    {
      caption:
        "Long-term leadership in CLL: 78-month Phase 3 data reinforcing durability as the standard clinicians expect.",
      category: "educational",
    },
    {
      caption:
        "Live from #ELCC2026 — advancing lung cancer care and engaging with the global oncology community.",
      category: "behind-the-scenes",
    },
    {
      caption:
        "World Cancer Day: united by unique experiences. Our colleagues share what #PatientsFirst means to them.",
      category: "ugc",
    },
    {
      caption:
        "BeOne Q1 2026 financial results and business updates — strong execution across hematology and solid tumor franchises.",
      category: "promotional",
    },
    {
      caption:
        "Esophageal cancer often goes undetected until later stages. Test your awareness and learn how we're supporting patients.",
      category: "educational",
    },
    {
      caption:
        "Great Place to Work certified — culture that powers global oncology innovation.",
      category: "behind-the-scenes",
    },
    {
      caption:
        "Video: Mark Lanasa, M.D., Ph.D., on solid tumor pipeline momentum spanning breast, lung, and GI cancers.",
      category: "educational",
    },
  ],
  x: [
    {
      caption:
        "At #ASCO26 we're sharing data that shifts the CLL conversation beyond short-term endpoints. Durability matters. #TeamBeOne",
      category: "educational",
    },
    {
      caption:
        "One Save Changes Everything. Proud of our Tim Howard partnership and the purpose behind it. #BeOneAtASCO",
      category: "promotional",
    },
    {
      caption:
        "Solid tumor pipeline momentum at ASCO — hepatocellular, GEA, and gynecological cancers. #BeOneInnovator",
      category: "educational",
    },
    {
      caption:
        "Q1 2026 results are in. Sustained competitive advantages in R&D, clinical development, and manufacturing. Press release ↓",
      category: "promotional",
    },
    {
      caption:
        "Patients First is the driver for what we do, every day. Richard's esophageal cancer story is a reminder why.",
      category: "educational",
    },
    {
      caption:
        "60+ abstracts at ASCO & EHA — hematology depth + solid tumor acceleration. Congress season is our runway.",
      category: "promotional",
    },
    {
      caption:
        "FDA Orphan Drug Designation in HCC for our GPC3x4-1BB bispecific. #LiverCancer #BeOneInnovator",
      category: "educational",
    },
    {
      caption:
        "Responsible Business & Sustainability Report 2025 — operating responsibly while expanding global access to cancer care.",
      category: "educational",
    },
    {
      caption:
        "AI is reshaping cancer care navigation — we're focused on tools that help patients, not hype. Thread 🧵",
      category: "educational",
    },
    {
      caption:
        "EHA 2026 — Booth G2.01. Come connect with Team BeOne. Intended for healthcare professionals only.",
      category: "behind-the-scenes",
    },
  ],
  youtube: [
    {
      caption:
        "ASCO 2026 Highlights | BeOne solid tumor and hematology data — full congress recap and key takeaways for clinicians.",
      category: "educational",
    },
    {
      caption:
        "Richard's Story — Esophageal Cancer | A #PatientsFirst patient perspective on diagnosis, treatment, and life after.",
      category: "educational",
    },
    {
      caption:
        "CLL Durability Explained | Dr. Amit Agarwal on why 78-month follow-up data changes first-line treatment conversations.",
      category: "educational",
    },
    {
      caption:
        "One Save Changes Everything | Tim Howard x BeOne — purpose, partnership, and stopping cancer together.",
      category: "promotional",
    },
    {
      caption:
        "Solid Tumor Pipeline Deep Dive | Dr. Mark Lanasa on breast, lung, and GI progress at ASCO 2026.",
      category: "educational",
    },
    {
      caption:
        "BeOne Q1 2026 Financial Results | CEO John V. Oyler on growth, pipeline, and global oncology leadership.",
      category: "educational",
    },
    {
      caption:
        "Responsible Business & Sustainability Report 2025 | How Patients First anchors our ESG strategy.",
      category: "educational",
    },
    {
      caption:
        "Behind the Science: BTK inhibitors in CLL | Mechanism, evidence, and what long-term data means for practice.",
      category: "educational",
    },
    {
      caption:
        "EHA 2026 Booth Tour | Hematology community, new data, and the people behind Team BeOne.",
      category: "behind-the-scenes",
    },
    {
      caption:
        "Esophageal Cancer Awareness | Symptoms, screening, and why early action matters — with BeOne medical leaders.",
      category: "educational",
    },
  ],
};

function makeSeedPost(
  platform: Exclude<Platform, "linkedin" | "tiktok">,
  index: number,
  template: { caption: string; category: SocialPost["category"] }
): SocialPost {
  const daysBack = 2 + index * 5;
  const reach =
    platform === "youtube"
      ? 15000 + index * 4200
      : platform === "instagram"
        ? 9000 + index * 2800
        : platform === "facebook"
          ? 7000 + index * 2100
          : 4000 + index * 1200;
  const impressions = Math.round(reach * (1.3 + (index % 3) * 0.15));
  const likes = Math.floor(
    reach * (platform === "youtube" ? 0.04 : 0.025 + (index % 4) * 0.005)
  );
  const comments = Math.floor(likes * 0.08);
  const shares = Math.floor(likes * (platform === "x" ? 0.15 : 0.06));
  const saves = platform === "instagram" ? Math.floor(likes * 0.2) : 0;
  const clicks = Math.floor(impressions * 0.012);
  const isPaid = index % 6 === 0;

  return {
    id: `${platform}-seed-${index + 1}`,
    platform,
    category: template.category,
    storyBeat: inferStoryBeat(template.caption),
    type: isPaid ? "paid" : "organic",
    publishedAt: subDays(now, daysBack).toISOString(),
    caption: template.caption,
    imageUrl: `https://picsum.photos/seed/beone-${platform}-${index}/600/600`,
    metrics: {
      impressions,
      reach,
      likes,
      comments,
      shares,
      saves,
      clicks,
      spend: isPaid ? 150 + index * 45 : undefined,
    },
  };
}

export function generateChannelSeedPosts(): SocialPost[] {
  const posts: SocialPost[] = [];
  for (const [platform, templates] of Object.entries(SEED_BY_PLATFORM)) {
    templates.forEach((template, index) => {
      posts.push(
        makeSeedPost(
          platform as Exclude<Platform, "linkedin" | "tiktok">,
          index,
          template
        )
      );
    });
  }
  return posts;
}
