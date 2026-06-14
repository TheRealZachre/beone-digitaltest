export type ImpactLevel = "high" | "medium" | "low";
export type EffortLevel = "high" | "medium" | "low";
export type FindingStatus = "good" | "warning" | "critical";

export interface WikipediaFinding {
  id: string;
  page: "company" | "ceo" | "cross";
  section: string;
  title: string;
  status: FindingStatus;
  summary: string;
  whyItMatters: string;
  howToFix: string;
  impact: ImpactLevel;
  effort: EffortLevel;
}

export interface WikipediaPageSnapshot {
  title: string;
  url: string;
  exists: boolean;
  lastEdited?: string;
  byteSize?: number;
  wordCount: number;
  referenceCount: number;
  sectionCount: number;
  sections: string[];
  hasInfobox: boolean;
  hasLeadImage: boolean;
  maintenanceFlags: string[];
  categories: string[];
  mentionsLegacyName: boolean;
  mentionsCurrentName: boolean;
  score: number;
  status: FindingStatus;
  workingWell: string[];
  needsImprovement: string[];
}

export interface WikipediaRoadmapItem {
  timeframe: "30-day" | "60-day" | "90-day";
  title: string;
  tasks: string[];
}

export interface WikipediaAuditResponse {
  companyName: string;
  ceoName: string;
  auditedAt: string;
  responseTimeMs: number;
  overallScore: number;
  executiveSummary: string;
  company: WikipediaPageSnapshot;
  ceo: WikipediaPageSnapshot;
  topPriorities: WikipediaFinding[];
  findings: WikipediaFinding[];
  roadmap: WikipediaRoadmapItem[];
  narrativeSignals: string[];
}

export interface WikipediaAuditRequest {
  companyPage?: string;
  ceoPage?: string;
  companyName?: string;
  ceoName?: string;
}
