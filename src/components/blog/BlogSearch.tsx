import { useMemo, useState } from "react";

type PostPreview = {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  series?: string;
  locale: "en" | "ko";
  languages: { locale: "en" | "ko"; href: string }[];
};

type Props = {
  posts: PostPreview[];
  tags: string[];
  locale: "en" | "ko";
  messages: {
    searchPosts: string;
    filterByTag: string;
    all: string;
    resultOne: string;
    resultMany: string;
    noMatch: string;
  };
  tagLabels: Record<string, string>;
};

const formatDate = (value: string, locale: "en" | "ko") =>
  new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));

export default function BlogSearch({ posts, tags, locale, messages, tagLabels }: Props) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesTag = !activeTag || post.tags.includes(activeTag);
      const haystack = [
        post.title,
        post.description,
        post.series ?? "",
        post.tags.join(" ")
      ]
        .join(" ")
        .toLowerCase();

      return matchesTag && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [activeTag, posts, query]);

  return (
    <div className="blog-search">
      <div className="blog-search__controls">
        <div className="blog-search__field">
          <div className="blog-search__field-heading"><label htmlFor="blog-search-query">{messages.searchPosts}</label>{(query.trim() || activeTag) && <p className="metadata" role="status">{(filteredPosts.length === 1 ? messages.resultOne : messages.resultMany).replace("{count}", String(filteredPosts.length))}</p>}</div>
          <input
            id="blog-search-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="blog-search__tags" role="group" aria-label={messages.filterByTag}>
          <button
            type="button"
            className={!activeTag ? "is-active" : ""}
            aria-pressed={!activeTag}
            onClick={() => setActiveTag("")}
          >
            {messages.all}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={activeTag === tag ? "is-active" : ""}
              aria-pressed={activeTag === tag}
              onClick={() => setActiveTag(tag)}
            >
              {tagLabels[tag] ?? tag}
            </button>
          ))}
        </div>
      </div>

      <div className="blog-search__results">
        {filteredPosts.length > 0 ? (
          <ul className="list">
            {filteredPosts.map((post) => (
              <li className="list-item" key={`${post.locale}/${post.slug}`}>
                <h2 lang={post.locale}><a href={`${post.locale === "ko" ? "/ko" : ""}/blog/${post.slug}/`}>{post.title}</a></h2>
                <p lang={post.locale}>{post.description}</p>
                <div className="blog-card__metadata"><p className="metadata">
                  {formatDate(post.pubDate, locale)}{post.tags.length > 0 && ` · ${post.tags.map((tag) => tagLabels[tag] ?? tag).join(", ")}`}
                </p>
                {post.languages.length > 1 && <span className="blog-languages" role="group" aria-label={locale === "ko" ? `${post.title} 언어 선택` : `Languages for ${post.title}`}>
                  {post.languages.map((version) => version.locale === post.locale
                    ? <span key={version.locale} lang={version.locale} aria-label={locale === "ko" ? `${version.locale === "ko" ? "한국어" : "English"}로 표시 중` : `Shown in ${version.locale === "ko" ? "Korean" : "English"}`}>{version.locale === "ko" ? "한국어" : "EN"}</span>
                    : <a key={version.locale} href={version.href} lang={version.locale} hrefLang={version.locale}>{version.locale === "ko" ? "한국어" : "EN"}</a>)}
                </span>}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">{messages.noMatch}</p>
        )}
      </div>
    </div>
  );
}
