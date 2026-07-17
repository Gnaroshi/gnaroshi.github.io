const DAY_MS = 86_400_000;
export const CURRENT_FOCUS_FRESH_DAYS = 45;

export type CurrentFocusFreshness = {
  ageDays: number | null;
  status: "fresh" | "stale" | "future" | "invalid";
  isFresh: boolean;
};

export function currentFocusAgeDays(lastUpdated: string, now = new Date()): number {
  const updated = new Date(`${lastUpdated}T00:00:00.000Z`);
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return Math.floor((today.getTime() - updated.getTime()) / DAY_MS);
}

export function isCurrentFocusFresh(lastUpdated: string, now = new Date()): boolean {
  return getCurrentFocusFreshness(lastUpdated, now).isFresh;
}

export function getCurrentFocusFreshness(lastUpdated: string, now = new Date()): CurrentFocusFreshness {
  const ageDays = currentFocusAgeDays(lastUpdated, now);
  if (!Number.isFinite(ageDays)) return { ageDays: null, status: "invalid", isFresh: false };
  if (ageDays < 0) return { ageDays, status: "future", isFresh: false };
  if (ageDays <= CURRENT_FOCUS_FRESH_DAYS) return { ageDays, status: "fresh", isFresh: true };
  return { ageDays, status: "stale", isFresh: false };
}
