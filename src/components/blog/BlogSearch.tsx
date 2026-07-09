import { useMemo, useState } from "react";

type PostPreview = {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  series?: string;
  readingTime: string;
};

type Props = {
  posts: PostPreview[];
  tags: string[];
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));

export default function BlogSearch({ posts, tags }: Props) {
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
          <span>Search posts</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="blog-search__tags" aria-label="Filter by tag">
          <button
            type="button"
            className={!activeTag ? "is-active" : ""}
            onClick={() => setActiveTag("")}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={activeTag === tag ? "is-active" : ""}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="blog-search__results" aria-live="polite">
        <p className="metadata">{filteredPosts.length} post{filteredPosts.length === 1 ? "" : "s"}</p>
        {filteredPosts.length > 0 ? (
          <ul className="list">
            {filteredPosts.map((post) => (
              <li className="list-item" key={post.slug}>
                <h3><a href={`/blog/${post.slug}/`}>{post.title}</a></h3>
                <p>{post.description}</p>
                <p className="metadata">
                  {formatDate(post.pubDate)} · {post.readingTime} · {post.tags.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No posts match the current filters.</p>
        )}
      </div>
    </div>
  );
}
