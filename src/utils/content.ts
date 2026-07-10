import { getCollection, type CollectionEntry } from "astro:content";
import { getYearMonthKey } from "./date";
import { formatLocalizedMonth } from "../i18n/date";
import type { Locale } from "../i18n/types";
import { getLocalePath } from "../i18n/utils";
import { getContentSlug, getTranslationEntry } from "./localizedContent";
import { getReadingTime } from "./readingTime";
import { slugify } from "./slug";
import { shouldBuildDetailPage, shouldShowInIndex } from "./visibility";
import { getContentFeedRecordCount } from "./contentFeed";

export type BlogPost = CollectionEntry<"blog">;

export type BlogPostPreview = {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  series?: string;
  readingTime: string;
  locale: Locale;
};

export type ArchiveGroup = {
  key: string;
  label: string;
  posts: BlogPost[];
};

export async function getAllBlogPosts(locale: Locale = "en"): Promise<BlogPost[]> {
  if (getContentFeedRecordCount("blog") === 0) return [];
  const posts = await getCollection("blog");
  return sortBlogPosts(posts.filter((post) => post.data.locale === locale));
}

export async function getAllBlogPostsAcrossLocales(): Promise<BlogPost[]> {
  if (getContentFeedRecordCount("blog") === 0) return [];
  return sortBlogPosts(await getCollection("blog"));
}

export async function getPublishedBlogPosts(locale: Locale = "en"): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts(locale);
  return posts.filter((post) => shouldShowInIndex(post.data, { includeDrafts: !import.meta.env.PROD }));
}

export async function getBuildableBlogPosts(locale: Locale = "en"): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts(locale);
  return posts.filter((post) =>
    shouldBuildDetailPage(post.data, {
      includeDrafts: !import.meta.env.PROD,
      includeHidden: !import.meta.env.PROD
    })
  );
}

export function sortBlogPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function getFeaturedBlogPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter((post) => post.data.featured);
}

export function getAllBlogTags(posts: BlogPost[]): string[] {
  return [...new Set(posts.flatMap((post) => post.data.tags))]
    .sort((a, b) => a.localeCompare(b));
}

export function getPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter((post) => post.data.tags.some((postTag) => slugify(postTag) === tag));
}

export function getArchiveGroups(posts: BlogPost[], locale: Locale = "en"): ArchiveGroup[] {
  const groups = new Map<string, BlogPost[]>();

  for (const post of posts) {
    const key = getYearMonthKey(post.data.pubDate);
    groups.set(key, [...(groups.get(key) ?? []), post]);
  }

  return [...groups.entries()].map(([key, groupPosts]) => ({
    key,
    label: formatLocalizedMonth(groupPosts[0].data.pubDate, locale),
    posts: sortBlogPosts(groupPosts)
  }));
}

export function getSeriesPosts(posts: BlogPost[], series?: string): BlogPost[] {
  if (!series) {
    return [];
  }

  return posts
    .filter((post) => post.data.series === series)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}

export function getAdjacentPosts(posts: BlogPost[], currentPost: BlogPost) {
  const index = posts.findIndex((post) => post.id === currentPost.id);

  return {
    previous: index >= 0 ? posts[index + 1] : undefined,
    next: index > 0 ? posts[index - 1] : undefined
  };
}

export function getPostReadingTime(post: BlogPost): string {
  return String(post.data.readingTime ?? getReadingTime(post.body ?? ""));
}

export function toBlogPostPreview(post: BlogPost): BlogPostPreview {
  return {
    slug: getContentSlug(post.id),
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.pubDate.toISOString(),
    tags: post.data.tags,
    series: post.data.series,
    readingTime: getPostReadingTime(post),
    locale: post.data.locale
  };
}

export function getBlogPostSlug(post: BlogPost): string {
  return getContentSlug(post.id);
}

export function getBlogPostHref(post: BlogPost): string {
  return getLocalePath(post.data.locale, `/blog/${getBlogPostSlug(post)}/`);
}

export function getBlogTranslation(posts: BlogPost[], post: BlogPost, locale: Locale): BlogPost | undefined {
  return getTranslationEntry(posts, post, locale);
}
