export function formatDate(date: Date): string {
  return date.toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function formatMonth(date: Date): string {
  return date.toLocaleDateString("en", {
    year: "numeric",
    month: "long"
  });
}

export function getYearMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

