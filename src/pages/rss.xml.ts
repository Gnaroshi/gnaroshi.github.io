import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { profile } from "../data/profile";
import { getPublishedBlogPosts } from "../utils/content";

export async function GET(context: APIContext) {
  const posts = await getPublishedBlogPosts();

  return rss({
    title: `${profile.siteName} Blog`,
    description: "Technical notes, research logs, paper summaries, and project writeups.",
    site: context.site ?? profile.domain,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`
    }))
  });
}

