export function parseDurationLabel(label: string): number {
  const trimmed = label.trim();
  if (!trimmed) return 0;

  if (/^\d{1,2}:\d{2}:\d{2}$/.test(trimmed)) {
    const [h, m, s] = trimmed.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  }

  const parts = trimmed.split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n))) return 0;

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] ?? 0;
}
