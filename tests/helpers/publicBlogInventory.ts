import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { contentFeedRoot } from "../../src/utils/contentFeed";

export type PublicBlogRecord = {
  locale: "en" | "ko";
  translationKey: string;
  slug: string;
  href: string;
  title: string;
  category: string;
  stage: string;
  date: string;
};

export function publicBlogInventory(): PublicBlogRecord[] {
  return (["en", "ko"] as const).flatMap((locale) => {
    const directory = join(contentFeedRoot, "blog", locale);
    if (!existsSync(directory)) return [];
    return readdirSync(directory, { recursive: true })
      .filter((file): file is string => typeof file === "string" && /\.mdx?$/.test(file))
      .flatMap((file) => {
        const source = readFileSync(join(directory, file), "utf8");
        const metadata = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? "";
        const value = (key: string) => metadata.match(new RegExp(`^${key}:\\s*(?:'([^']*)'|"([^"]*)"|([^\\r\\n]*))\\s*$`, "m"))?.slice(1).find((part) => part !== undefined)?.trim();
        if (value("visibility") !== "public" || value("draft") === "true") return [];
        const slug = value("canonicalSlug");
        const translationKey = value("translationKey");
        if (!slug || !translationKey) throw new Error(`Validated public blog record is missing its identity: ${file}`);
        return [{ locale, slug, translationKey, href: `${locale === "ko" ? "/ko" : ""}/blog/${slug}/`, title: value("title") ?? "", category: value("category") ?? "", stage: value("contentStage") ?? "", date: value("publishDate") ?? "" }];
      });
  });
}

export function preferredPublicBlogRecords(locale: "en" | "ko"): PublicBlogRecord[] {
  const selected = new Map<string, PublicBlogRecord>();
  for (const record of publicBlogInventory()) {
    const previous = selected.get(record.translationKey);
    if (!previous || (previous.locale !== locale && record.locale === locale)) selected.set(record.translationKey, record);
  }
  return [...selected.values()].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
