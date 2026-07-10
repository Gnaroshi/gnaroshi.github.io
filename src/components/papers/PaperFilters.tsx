import { useMemo, useState } from "react";
import type { PaperRecord } from "../../utils/papers";
import PaperCard from "./PaperCard";
import PaperHeatmap from "./PaperHeatmap";
import type { IslandMessages } from "../../i18n/islands";
import type { Locale } from "../../i18n/types";

interface Props {
  papers: PaperRecord[];
  countsByDate: Record<string, number>;
  tags: string[];
  years: number[];
  today: string;
  locale: Locale;
  messages: IslandMessages["paper"];
}

const statuses: Array<PaperRecord["status"]> = ["planned", "pass1", "pass2", "pass3", "read", "implemented", "abandoned"];
const depths: Array<PaperRecord["depth"]> = ["skim", "understand", "deep", "reproduce", "implement"];
const depthRank: Record<PaperRecord["depth"], number> = {
  skim: 1,
  understand: 2,
  deep: 3,
  reproduce: 4,
  implement: 5
};

function includesSearch(paper: PaperRecord, query: string): boolean {
  if (!query) return true;

  const haystack = [
    paper.title,
    paper.oneLineSummary,
    paper.coreQuestion,
    paper.coreIdea,
    paper.venue,
    String(paper.year),
    paper.authors.join(" "),
    paper.tags.join(" "),
    paper.relatedTopics.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function sortPapers(papers: PaperRecord[], sortBy: string): PaperRecord[] {
  return [...papers].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "difficulty") return b.difficulty - a.difficulty || a.title.localeCompare(b.title);
    if (sortBy === "reading-time") return b.readingTimeMinutes - a.readingTimeMinutes || a.title.localeCompare(b.title);
    if (sortBy === "depth") return depthRank[b.depth] - depthRank[a.depth] || a.title.localeCompare(b.title);

    const aDate = a.readDate ?? "0000-00-00";
    const bDate = b.readDate ?? "0000-00-00";
    return bDate.localeCompare(aDate) || a.title.localeCompare(b.title);
  });
}

export default function PaperFilters({ papers, countsByDate, tags, years, today, locale, messages }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [depth, setDepth] = useState("");
  const [tag, setTag] = useState("");
  const [year, setYear] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPapers = useMemo(() => {
    const filtered = papers.filter((paper) => {
      if (!includesSearch(paper, normalizedQuery)) return false;
      if (status && paper.status !== status) return false;
      if (depth && paper.depth !== depth) return false;
      if (tag && !paper.tags.map((paperTag) => paperTag.toLowerCase()).includes(tag)) return false;
      if (year && String(paper.year) !== year) return false;
      if (difficulty && String(paper.difficulty) !== difficulty) return false;
      if (featuredOnly && !paper.featured) return false;
      if (selectedDate && paper.readDate !== selectedDate) return false;
      return true;
    });

    return sortPapers(filtered, sortBy);
  }, [papers, normalizedQuery, status, depth, tag, year, difficulty, featuredOnly, selectedDate, sortBy]);

  const hasFilters = Boolean(
    normalizedQuery || status || depth || tag || year || difficulty || featuredOnly || selectedDate || sortBy !== "latest"
  );

  function resetFilters() {
    setQuery("");
    setStatus("");
    setDepth("");
    setTag("");
    setYear("");
    setDifficulty("");
    setFeaturedOnly(false);
    setSelectedDate("");
    setSortBy("latest");
  }

  return (
    <div className="paper-dashboard-island">
      <PaperHeatmap countsByDate={countsByDate} selectedDate={selectedDate} today={today} onSelectDate={setSelectedDate} locale={locale} messages={messages} />

      <section className="paper-filter-panel" aria-labelledby="paper-filter-heading">
        <div className="paper-filter-panel__header">
          <div>
            <p className="eyebrow">{messages.notebook}</p>
            <h2 id="paper-filter-heading">{messages.searchAndFilter}</h2>
          </div>
          {hasFilters ? (
            <button type="button" className="paper-filter-panel__reset" onClick={resetFilters}>
              {messages.resetFilters}
            </button>
          ) : null}
        </div>

        <div className="paper-filter-grid">
          <label className="paper-field paper-field--wide">
            <span>{messages.search}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <label className="paper-field">
            <span>{messages.status}</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">{messages.allStatuses}</option>
              {statuses.map((item) => (
                <option value={item} key={item}>
                  {messages.statuses[item]}
                </option>
              ))}
            </select>
          </label>

          <label className="paper-field">
            <span>{messages.depth}</span>
            <select value={depth} onChange={(event) => setDepth(event.target.value)}>
              <option value="">{messages.allDepths}</option>
              {depths.map((item) => (
                <option value={item} key={item}>
                  {messages.depths[item]}
                </option>
              ))}
            </select>
          </label>

          <label className="paper-field">
            <span>{messages.tag}</span>
            <select value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="">{messages.allTags}</option>
              {tags.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="paper-field">
            <span>{messages.year}</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="">{messages.allYears}</option>
              {years.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="paper-field">
            <span>{messages.difficulty}</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              <option value="">{messages.allLevels}</option>
              {[1, 2, 3, 4, 5].map((item) => (
                <option value={item} key={item}>
                  {item}/5
                </option>
              ))}
            </select>
          </label>

          <label className="paper-field">
            <span>{messages.sort}</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="latest">{messages.latest}</option>
              <option value="title">{messages.title}</option>
              <option value="difficulty">{messages.difficulty}</option>
              <option value="reading-time">{messages.readingTime}</option>
              <option value="depth">{messages.depth}</option>
            </select>
          </label>

          <label className="paper-check">
            <input type="checkbox" checked={featuredOnly} onChange={(event) => setFeaturedOnly(event.target.checked)} />
            <span>{messages.featuredOnly}</span>
          </label>
        </div>

        {selectedDate ? (
          <p className="paper-selected-date">
            {messages.filteringBy} <strong>{selectedDate}</strong>
            <button type="button" onClick={() => setSelectedDate("")}>
              {messages.clearDate}
            </button>
          </p>
        ) : null}
      </section>

      <section className="paper-results" aria-labelledby="paper-results-heading">
        <div className="paper-results__header">
          <h2 id="paper-results-heading">{messages.cards}</h2>
          <p>
            {messages.shown.replace("{shown}", String(filteredPapers.length)).replace("{total}", String(papers.length))}
          </p>
        </div>

        {papers.length === 0 ? (
          <div className="paper-empty-state">
            <h3>{messages.noLogs}</h3>
            <p>{messages.noLogsBody}</p>
          </div>
        ) : filteredPapers.length > 0 ? (
          <div className="paper-card-list">
            {filteredPapers.map((paper) => (
              <PaperCard paper={paper} key={paper.id} locale={locale} messages={messages} />
            ))}
          </div>
        ) : (
          <div className="paper-empty-state">
            <h3>{messages.noMatches}</h3>
            <p>{messages.noMatchesBody}</p>
          </div>
        )}
      </section>
    </div>
  );
}
