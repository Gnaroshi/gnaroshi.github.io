const SAFE_ABSOLUTE_SCHEMES = new Set(["http:", "https:", "mailto:", "tel:"]);

export function assertSafePublicUrl(value: string): string {
  if (value.startsWith("/") || value.startsWith("#") || value.startsWith("?")) return value;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid public URL: ${value}`);
  }
  if (!SAFE_ABSOLUTE_SCHEMES.has(url.protocol)) throw new Error(`Unsafe public URL scheme: ${url.protocol}`);
  return value;
}
