import { useMemo, useState } from "react";
import type { QueueRecord } from "../../utils/queue";
import type { IslandMessages } from "../../i18n/islands";
import type { Locale } from "../../i18n/types";

type Props = {
  items: QueueRecord[];
  topics: string[];
  tags: string[];
  locale: Locale;
  messages: IslandMessages["queue"];
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

export default function QueueDashboard({ items, topics, tags, locale, messages }: Props) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [tag, setTag] = useState("");
  const [priority, setPriority] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");

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

  return (
    <div className="learning-dashboard-island" lang={locale}>
      <section className="paper-filter-panel" aria-labelledby="queue-filter-heading">
        <div className="paper-filter-panel__header">
          <div>
            <p className="eyebrow">{messages.controls}</p>
            <h2 id="queue-filter-heading">{messages.filter}</h2>
          </div>
        </div>
        <div className="paper-filter-grid">
          <label className="paper-field paper-field--wide">
            <span>{messages.search}</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label className="paper-field">
            <span>{messages.priority}</span>
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="">{messages.allPriorities}</option>
              {priorities.map((value) => (
                <option key={value} value={value}>
                  {messages.priorities[value]}
                </option>
              ))}
            </select>
          </label>
          <label className="paper-field">
            <span>{messages.source}</span>
            <select value={source} onChange={(event) => setSource(event.target.value)}>
              <option value="">{messages.allSources}</option>
              {sources.map((value) => (
                <option key={value} value={value}>
                  {messages.sources[value]}
                </option>
              ))}
            </select>
          </label>
          <label className="paper-field">
            <span>{messages.status}</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">{messages.allStatuses}</option>
              {statuses.map((value) => (
                <option key={value} value={value}>
                  {messages.statuses[value]}
                </option>
              ))}
            </select>
          </label>
          <label className="paper-field">
            <span>{messages.topic}</span>
            <select value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option value="">{messages.allTopics}</option>
              {topics.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="paper-field">
            <span>{messages.tag}</span>
            <select value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="">{messages.allTags}</option>
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
          <h2 id="queue-results-heading">{messages.results}</h2>
          <p>
            {messages.shown.replace("{shown}", String(filteredItems.length)).replace("{total}", String(items.length))}
          </p>
        </div>
        {items.length === 0 ? (
          <div className="paper-empty-state">
            <h3>{messages.empty}</h3>
            <p>{messages.emptyBody}</p>
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
                      {messages.priorities[item.priority]}
                    </span>
                    <span className="paper-badge paper-badge--muted">{messages.statuses[item.status]}</span>
                  </div>
                  <p>{item.reasonToRead}</p>
                  <p className="metadata">
                    {item.authors.join(", ")} · {item.venue} · {item.year} · {messages.added} {item.addedDate}
                    {item.targetDate ? ` · ${messages.target} ${item.targetDate}` : ""}
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
                  <a href={item.href}>{messages.open}</a>
                  {item.paperUrl ? (
                    <a href={item.paperUrl} target="_blank" rel="noopener noreferrer external">
                      {messages.paper}
                    </a>
                  ) : null}
                  {item.codeUrl ? (
                    <a href={item.codeUrl} target="_blank" rel="noopener noreferrer external">
                      {messages.code}
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="paper-empty-state">
            <h3>{messages.empty}</h3>
            <p>{messages.emptyBody}</p>
          </div>
        )}
      </section>
    </div>
  );
}
