const MAINTENANCE_TEMPLATES = [
  { pattern: /\{\{[Cc]OI/i, label: "Conflict of interest" },
  { pattern: /\{\{[Pp]aid contributor/i, label: "Paid contributor" },
  { pattern: /\{\{[Aa]dvert/i, label: "Advertisement tone" },
  { pattern: /\{\{[Pp]OV/i, label: "Point of view dispute" },
  { pattern: /\{\{[Uu]pdate/i, label: "Needs update" },
  { pattern: /\{\{[Ss]tub/i, label: "Stub article" },
  { pattern: /\{\{[Uu]nreferenced/i, label: "Unreferenced" },
  { pattern: /\{\{[Cc]itation needed/i, label: "Citation needed tags" },
  { pattern: /\{\{[Cc]opy edit/i, label: "Copy editing needed" },
  { pattern: /\{\{[Cc]leanup/i, label: "Cleanup needed" },
];

const SECTION_PATTERN = /^={2,}\s*([^=]+?)\s*={2,}$/gm;

export interface ParsedWikipediaArticle {
  wordCount: number;
  referenceCount: number;
  sections: string[];
  hasInfobox: boolean;
  hasLeadImage: boolean;
  maintenanceFlags: string[];
  externalLinkCount: number;
  wikilinkCount: number;
  plainText: string;
}

export function parseWikipediaArticle(
  wikitext: string | undefined,
  extract: string | undefined
): ParsedWikipediaArticle {
  const source = wikitext ?? "";
  const plainText = (extract ?? stripWikitext(source))
    .replace(/\s+/g, " ")
    .trim();

  const sections = Array.from(source.matchAll(SECTION_PATTERN), (match) =>
    match[1].trim()
  );

  const maintenanceFlags = MAINTENANCE_TEMPLATES.filter(({ pattern }) =>
    pattern.test(source)
  ).map(({ label }) => label);

  return {
    wordCount: plainText ? plainText.split(/\s+/).length : 0,
    referenceCount: countReferences(source),
    sections,
    hasInfobox: /\{\{[Ii]nfobox/i.test(source),
    hasLeadImage: /\[\[(?:File|Image):/i.test(source.slice(0, 2500)),
    maintenanceFlags,
    externalLinkCount: (source.match(/\[(?:https?:\/\/|www\.)/gi) ?? []).length,
    wikilinkCount: (source.match(/\[\[[^\]]+\]\]/g) ?? []).length,
    plainText,
  };
}

function countReferences(wikitext: string): number {
  const refTags = wikitext.match(/<ref\b/gi) ?? [];
  const citeTemplates =
    wikitext.match(/\{\{[Cc]ite\s+(?:news|web|journal|book|press release)/g) ??
    [];
  return refTags.length + citeTemplates.length;
}

function stripWikitext(wikitext: string): string {
  return wikitext
    .replace(/\{\{[\s\S]*?\}\}/g, " ")
    .replace(/<ref[\s\S]*?(\/>|<\/ref>)/gi, " ")
    .replace(/\[\[(?:File|Image):[\s\S]*?\]\]/gi, " ")
    .replace(/\[\[([^|\]]+\|)?([^\]]+)\]\]/g, "$2")
    .replace(/'{2,}/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/={2,}[^=]+={2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function daysSince(isoDate?: string): number | null {
  if (!isoDate) return null;
  const edited = new Date(isoDate).getTime();
  if (Number.isNaN(edited)) return null;
  return Math.floor((Date.now() - edited) / (1000 * 60 * 60 * 24));
}

export function mentionsTerm(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
}
