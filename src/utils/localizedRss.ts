import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { profile } from "../data/profile";
import type { Locale } from "../i18n/types";
import { translate } from "../i18n/utils";
import { getBlogPostHref, getPublishedBlogPosts } from "./content";

export async function buildLocalizedRss(context: APIContext, locale: Locale) {
  const posts = await getPublishedBlogPosts(locale);
  return rss({
    title: translate(locale, "site.rssTitle"),
    description: translate(locale, "writing.intro"),
    site: context.site ?? profile.domain,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getBlogPostHref(post)
    })),
    customData: `<language>${locale === "ko" ? "ko-KR" : "en-US"}</language>`
  });
}
