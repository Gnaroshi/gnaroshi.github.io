const DAY_MS = 86_400_000;

export function currentFocusAgeDays(lastUpdated: string, now = new Date()): number {
  const updated = new Date(`${lastUpdated}T00:00:00.000Z`);
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return Math.floor((today.getTime() - updated.getTime()) / DAY_MS);
}

export function isCurrentFocusFresh(lastUpdated: string, now = new Date()): boolean {
  const age = currentFocusAgeDays(lastUpdated, now);
  return age >= 0 && age <= 45;
}
