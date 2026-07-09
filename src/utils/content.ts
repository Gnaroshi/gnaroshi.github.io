import { getCollection, type CollectionEntry } from "astro:content";
import { formatMonth, getYearMonthKey } from "./date";
import { getReadingTime } from "./readingTime";
import { slugify } from "./slug";

export type BlogPost = CollectionEntry<"blog">;

export type BlogPostPreview = {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  series?: string;
  readingTime: string;
};

export type ArchiveGroup = {
  key: string;
  label: string;
  posts: BlogPost[];
};

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog");
  return sortBlogPosts(posts);
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter((post) => import.meta.env.PROD ? !post.data.draft : true);
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

export function getArchiveGroups(posts: BlogPost[]): ArchiveGroup[] {
  const groups = new Map<string, BlogPost[]>();

  for (const post of posts) {
    const key = getYearMonthKey(post.data.pubDate);
    groups.set(key, [...(groups.get(key) ?? []), post]);
  }

  return [...groups.entries()].map(([key, groupPosts]) => ({
    key,
    label: formatMonth(groupPosts[0].data.pubDate),
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
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.pubDate.toISOString(),
    tags: post.data.tags,
    series: post.data.series,
    readingTime: getPostReadingTime(post)
  };
}

