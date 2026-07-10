import { useMemo, useState } from "react";

type PostPreview = {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  series?: string;
  readingTime: string;
  locale: "en" | "ko";
};

type Props = {
  posts: PostPreview[];
  tags: string[];
  locale: "en" | "ko";
  messages: {
    searchPosts: string;
    filterByTag: string;
    all: string;
    resultCount: string;
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
        <label>
          <span>{messages.searchPosts}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="blog-search__tags" aria-label={messages.filterByTag}>
          <button
            type="button"
            className={!activeTag ? "is-active" : ""}
            onClick={() => setActiveTag("")}
          >
            {messages.all}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={activeTag === tag ? "is-active" : ""}
              onClick={() => setActiveTag(tag)}
            >
              {tagLabels[tag] ?? tag}
            </button>
          ))}
        </div>
      </div>

      <div className="blog-search__results" aria-live="polite">
        <p className="metadata">{messages.resultCount.replace("{count}", String(filteredPosts.length))}</p>
        {filteredPosts.length > 0 ? (
          <ul className="list">
            {filteredPosts.map((post) => (
              <li className="list-item" key={post.slug}>
                <h3><a href={`${locale === "ko" ? "/ko" : ""}/blog/${post.slug}/`}>{post.title}</a></h3>
                <p>{post.description}</p>
                <p className="metadata">
                  {formatDate(post.pubDate, locale)} · {post.readingTime} · {post.tags.map((tag) => tagLabels[tag] ?? tag).join(", ")}
                </p>
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
