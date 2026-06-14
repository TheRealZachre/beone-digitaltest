export type ImpactLevel = "high" | "medium" | "low";
export type EffortLevel = "high" | "medium" | "low";
export type FindingStatus = "good" | "warning" | "critical";

export interface AuditFinding {
  id: string;
  section: string;
  title: string;
  status: FindingStatus;
  summary: string;
  whyItMatters: string;
  howToFix: string;
  impact: ImpactLevel;
  effort: EffortLevel;
}

export interface AuditSectionResult {
  id: string;
  label: string;
  score: number;
  status: FindingStatus;
  workingWell: string[];
  needsImprovement: string[];
  findings: AuditFinding[];
}

export interface KeywordRanking {
  keyword: string;
  google: number | null;
  bing: number | null;
  yahoo: number | null;
  opportunity: string;
}

export interface RoadmapItem {
  timeframe: "30-day" | "60-day" | "90-day";
  title: string;
  tasks: string[];
}

export interface CompetitorComparison {
  domain: string;
  overallScore: number;
  titleLength: number;
  hasMetaDescription: boolean;
  h1Count: number;
  schemaTypes: string[];
  internalLinks: number;
  highlights: string[];
}

export interface WebsiteAuditResponse {
  url: string;
  domain: string;
  auditedAt: string;
  responseTimeMs: number;
  overallScore: number;
  executiveSummary: string;
  topPriorities: AuditFinding[];
  sections: AuditSectionResult[];
  priorityMatrix: AuditFinding[];
  rankingSnapshot: KeywordRanking[];
  roadmap: RoadmapItem[];
  competitor?: CompetitorComparison;
  searchEngineNotes: {
    engine: string;
    status: "analyzed" | "partial" | "integration-required";
    note: string;
  }[];
}

export interface WebsiteAuditRequest {
  url: string;
  competitorUrl?: string;
}
