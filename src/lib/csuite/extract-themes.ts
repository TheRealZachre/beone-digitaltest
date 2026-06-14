import { engagementRate } from "@/lib/metrics";
import type { SocialPost, StoryBeat } from "@/lib/types";
import type { CorporateTheme } from "./types";

interface ThemeRule {
  id: string;
  title: string;
  storyBeat: StoryBeat;
  patterns: RegExp[];
  suggestedAngles: string[];
}

const THEME_RULES: ThemeRule[] = [
  {
    id: "one-save-campaign",
    title: "One Save Changes Everything",
    storyBeat: "Brand Vision",
    patterns: [/one save|tim howard|goalkeeper|big tournament/i],
    suggestedAngles: [
      "Why purpose-driven campaigns must connect to patient impact",
      "What the One Save initiative says about BeOne's brand voice",
      "Translating a cultural moment into a cancer mission narrative",
    ],
  },
  {
    id: "asco-2026",
    title: "ASCO 2026 Congress & Pipeline Data",
    storyBeat: "Scientific Innovation",
    patterns: [/asco\s*#?26|#asco26|beoneatasco|fromfloortofeed/i],
    suggestedAngles: [
      "What ASCO data means for hematology and solid tumor leadership",
      "Congress as a moment to translate science into executive conviction",
      "Why durability and pipeline breadth defined our ASCO narrative",
    ],
  },
  {
    id: "cll-durability",
    title: "CLL Durability & Long-Term Outcomes",
    storyBeat: "Scientific Innovation",
    patterns: [
      /cll|chronic lymphocytic|78-month|btk inhibitor|sonrotoclax|mantle cell lymphoma|richter transformation/i,
    ],
    suggestedAngles: [
      "Why long-term evidence is redefining first-line CLL decisions",
      "Durability as the metric that matters for patients and clinicians",
      "What hematology leadership looks like when data outlast headlines",
    ],
  },
  {
    id: "solid-tumor-pipeline",
    title: "Solid Tumor Pipeline Acceleration",
    storyBeat: "Scientific Innovation",
    patterns: [
      /solid tumor|hepatocellular|gastroesophageal|gynecolog|her2|gea\b|mark lanasa|lung cancer|#elcc/i,
    ],
    suggestedAngles: [
      "Where solid tumor momentum creates the most patient urgency",
      "How executives should frame pipeline breadth without hype",
      "Breast, lung, and GI progress as a strategic inflection point",
    ],
  },
  {
    id: "fda-regulatory",
    title: "FDA & Regulatory Milestones",
    storyBeat: "Scientific Innovation",
    patterns: [
      /fda granted|priority review|orphan drug|accelerated approval|nejm|new england journal/i,
    ],
    suggestedAngles: [
      "What regulatory milestones signal about access and trust",
      "Translating FDA news into a clinician- and patient-ready story",
      "Regulatory progress as proof of execution, not just science",
    ],
  },
  {
    id: "patient-stories",
    title: "Patient Stories & Patients First",
    storyBeat: "Patient-Centered",
    patterns: [
      /patient story|you have cancer|meet richard|patientsfirst|patients first|patient voice|advocacy council/i,
    ],
    suggestedAngles: [
      "What patient stories should change in executive communication",
      "Patients First as an operating principle, not a tagline",
      "How leaders honor lived experience without appropriating it",
    ],
  },
  {
    id: "eha-2026",
    title: "EHA 2026 & Hematology Community",
    storyBeat: "Scientific Innovation",
    patterns: [/eha\s*#?26|eha 2026|#eha26/i],
    suggestedAngles: [
      "Why congress presence is a relationship story, not a booth story",
      "Connecting with the hematology community as executive leaders",
      "What EHA conversations reveal about unmet patient needs",
    ],
  },
  {
    id: "financial-investor",
    title: "Financial Results & Investor Narrative",
    storyBeat: "Scientific Innovation",
    patterns: [
      /financial results|first quarter|q1 2026|j\.p\. morgan|investor/i,
    ],
    suggestedAngles: [
      "How CEOs frame growth without losing the patient mission",
      "Quarterly results as context for long-term oncology strategy",
      "What investors should understand about pipeline vs. performance",
    ],
  },
  {
    id: "global-access",
    title: "Global Access & Community Impact",
    storyBeat: "Corporate Citizenship",
    patterns: [
      /max foundation|293 patients|global impact|access to cancer care|sub-saharan africa/i,
    ],
    suggestedAngles: [
      "Access partnerships as a leadership responsibility",
      "Why geography should not determine survival",
      "How executives champion global health equity credibly",
    ],
  },
  {
    id: "sustainability-esg",
    title: "Responsible Business & Sustainability",
    storyBeat: "Corporate Citizenship",
    patterns: [
      /sustainability report|responsible business|operating responsibly|#patientsfirst commitment/i,
    ],
    suggestedAngles: [
      "ESG as strategy, not sidebar — a CEO perspective",
      "How responsible business strengthens patient trust",
      "Sustainability narratives that resonate with employees and partners",
    ],
  },
  {
    id: "disease-awareness",
    title: "Disease Awareness & Advocacy",
    storyBeat: "Disease Awareness",
    patterns: [
      /awareness month|awareness day|esophageal cancer|world cancer day|rare disease day|poll:/i,
    ],
    suggestedAngles: [
      "Awareness without action is incomplete — an executive call to arms",
      "What advocacy moments demand from industry leaders",
      "Turning awareness campaigns into sustained policy and research momentum",
    ],
  },
  {
    id: "people-culture",
    title: "Team BeOne & Global Culture",
    storyBeat: "People & Culture",
    patterns: [
      /team beone|thailand|malaysia|singapore|great place to work|colleagues from across|japan office|voices of leadership/i,
    ],
    suggestedAngles: [
      "Culture as the engine behind global oncology execution",
      "What regional team stories reveal about leadership values",
      "Investing in people who deliver the mission every day",
    ],
  },
  {
    id: "ai-innovation",
    title: "AI & Digital Innovation in Oncology",
    storyBeat: "Scientific Innovation",
    patterns: [/\bai\b.*cancer|artificial intelligence|digital health/i],
    suggestedAngles: [
      "AI as a tool for patients and clinicians — not a replacement for judgment",
      "How executives should talk about innovation without overpromising",
      "The responsible path to AI in cancer care delivery",
    ],
  },
  {
    id: "policy-access",
    title: "Policy, Access & Advocacy",
    storyBeat: "Policy Advocacy",
    patterns: [
      /step therapy|payer|pbm|insurer|access barrier|medicare|reimbursement|policy advocacy/i,
    ],
    suggestedAngles: [
      "Access policy as a patient outcomes issue",
      "What industry leaders owe the public policy conversation",
      "Bridging science and policy for equitable cancer care",
    ],
  },
];

function summarizeCaption(caption: string): string {
  const cleaned = caption
    .replace(/#News for #Investors and #Media:\s*/gi, "")
    .replace(/#+\w+/g, "")
    .trim();
  const first =
    cleaned.split(/[.!?\n]/).find((s) => s.trim().length > 20)?.trim() ??
    cleaned;
  return first.length > 140 ? `${first.slice(0, 137)}...` : first;
}

function assignTheme(post: SocialPost): ThemeRule | null {
  const text = post.caption;
  for (const rule of THEME_RULES) {
    if (rule.patterns.some((p) => p.test(text))) return rule;
  }
  return null;
}

export function extractCorporateThemes(posts: SocialPost[]): CorporateTheme[] {
  const corporate = posts.filter((p) => p.platform === "linkedin");
  const source = corporate.length > 0 ? corporate : posts;

  const clusters = new Map<string, { rule: ThemeRule; posts: SocialPost[] }>();

  for (const post of source) {
    const rule = assignTheme(post);
    if (!rule) continue;

    const existing = clusters.get(rule.id);
    if (existing) {
      existing.posts.push(post);
    } else {
      clusters.set(rule.id, { rule, posts: [post] });
    }
  }

  const themes: CorporateTheme[] = [];

  for (const { rule, posts: clusterPosts } of clusters.values()) {
    const sorted = [...clusterPosts].sort(
      (a, b) =>
        engagementRate(b.metrics) - engagementRate(a.metrics) ||
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    const avgEngagement =
      sorted.reduce((sum, p) => sum + engagementRate(p.metrics), 0) /
      sorted.length;

    const narrativePoints = sorted
      .slice(0, 3)
      .map((p) => summarizeCaption(p.caption));

    themes.push({
      id: rule.id,
      title: rule.title,
      narrative: narrativePoints.join(" · "),
      storyBeat: rule.storyBeat,
      sourcePostIds: sorted.map((p) => p.id),
      engagementScore: Math.round(avgEngagement * 10) / 10,
      suggestedAngles: rule.suggestedAngles,
    });
  }

  return themes
    .sort(
      (a, b) =>
        b.sourcePostIds.length - a.sourcePostIds.length ||
        b.engagementScore - a.engagementScore
    )
    .slice(0, 12);
}
