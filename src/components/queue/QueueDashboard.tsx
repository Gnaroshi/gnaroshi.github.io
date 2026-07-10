import { useMemo, useState } from "react";
import type { QueueRecord } from "../../utils/queue";

type Props = {
  items: QueueRecord[];
  topics: string[];
  tags: string[];
};

const priorities: Array<QueueRecord["priority"]> = ["urgent", "high", "medium", "low"];
const statuses: Array<QueueRecord["status"]> = ["next", "reading", "queued", "converted", "skipped", "archived"];
const sources: Array<QueueRecord["source"]> = [
  "advisor",
  "lab",
  "citation",
  "arxiv",
  "github",
  "blog",
  "social",
  "course",
  "self",
  "other"
];

function matchesText(item: QueueRecord, query: string): boolean {
  if (!query) return true;
  return [
    item.title,
    item.authors.join(" "),
    item.venue,
    item.reasonToRead,
    item.relatedTopics.join(" "),
    item.relatedProjects.join(" "),
    item.tags.join(" ")
  ]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function conversionCommand(slug: string) {
  return `npm run paper:from-queue -- --slug ${slug}`;
}

export default function QueueDashboard({ items, topics, tags }: Props) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [tag, setTag] = useState("");
  const [priority, setPriority] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [copiedSlug, setCopiedSlug] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (!matchesText(item, normalizedQuery)) return false;
        if (topic && !item.relatedTopics.map((value) => value.toLowerCase()).includes(topic)) return false;
        if (tag && !item.tags.map((value) => value.toLowerCase()).includes(tag)) return false;
        if (priority && item.priority !== priority) return false;
        if (source && item.source !== source) return false;
        if (status && item.status !== status) return false;
        return true;
      }),
    [items, normalizedQuery, priority, source, status, tag, topic]
  );

  async function copyCommand(slug: string) {
    const command = conversionCommand(slug);
    try {
      await navigator.clipboard.writeText(command);
      setCopiedSlug(slug);
    } catch {
      setCopiedSlug("");
    }
  }

  return (
    <div className="learning-dashboard-island">
      <section className="paper-filter-panel" aria-labelledby="queue-filter-heading">
        <div className="paper-filter-panel__header">
          <div>
            <p className="eyebrow">Queue</p>
            <h2 id="queue-filter-heading">Filter reading queue</h2>
          </div>
        </div>
        <div className="paper-filter-grid">
          <label className="paper-field paper-field--wide">
            <span>Search</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label className="paper-field">
            <span>Priority</span>
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="">All priorities</option>
              {priorities.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="paper-field">
            <span>Source</span>
            <select value={source} onChange={(event) => setSource(event.target.value)}>
              <option value="">All sources</option>
              {sources.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="paper-field">
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              {statuses.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="paper-field">
            <span>Topic</span>
            <select value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option value="">All topics</option>
              {topics.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="paper-field">
            <span>Tag</span>
            <select value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="">All tags</option>
              {tags.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="paper-results" aria-labelledby="queue-results-heading">
        <div className="paper-results__header">
          <h2 id="queue-results-heading">Queued papers</h2>
          <p>
            {filteredItems.length} of {items.length} shown
          </p>
        </div>
        {items.length === 0 ? (
          <div className="paper-empty-state">
            <h3>No queued papers yet.</h3>
            <p>Add a short queue note when a paper is worth tracking before it becomes a full reading log.</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="queue-list">
            {filteredItems.map((item) => (
              <article key={item.id} className="queue-card">
                <div className="queue-card__main">
                  <div className="paper-card__title-row">
                    <h3>
                      <a href={item.href}>{item.title}</a>
                    </h3>
                    <span className={`paper-badge paper-badge--${item.priority === "urgent" ? "review-due" : "muted"}`}>
                      {item.priority}
                    </span>
                    <span className="paper-badge paper-badge--muted">{item.status}</span>
                  </div>
                  <p>{item.reasonToRead}</p>
                  <p className="metadata">
                    {item.authors.join(", ")} · {item.venue} · {item.year} · added {item.addedDate}
                    {item.targetDate ? ` · target ${item.targetDate}` : ""}
                  </p>
                </div>
                <div className="paper-card__tags">
                  {item.tags.map((value) => (
                    <span className="paper-tag" key={value}>
                      {value}
                    </span>
                  ))}
                  {item.relatedTopics.map((value) => (
                    <span className="paper-tag paper-tag--topic" key={value}>
                      {value}
                    </span>
                  ))}
                </div>
                <div className="paper-card__links">
                  <a href={item.href}>Detail page</a>
                  {item.paperUrl ? (
                    <a href={item.paperUrl} target="_blank" rel="noreferrer">
                      Paper
                    </a>
                  ) : null}
                  {item.codeUrl ? (
                    <a href={item.codeUrl} target="_blank" rel="noreferrer">
                      Code
                    </a>
                  ) : null}
                  <button type="button" onClick={() => copyCommand(item.id)}>
                    {copiedSlug === item.id ? "Copied" : "Copy conversion command"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="paper-empty-state">
            <h3>No queued papers match these filters.</h3>
            <p>Adjust the filters to return to the full reading queue.</p>
          </div>
        )}
      </section>
    </div>
  );
}
