import { useMemo, useState } from "react";
import type { PaperRecord } from "../../utils/papers";
import PaperCard from "./PaperCard";
import PaperHeatmap from "./PaperHeatmap";

interface Props {
  papers: PaperRecord[];
  countsByDate: Record<string, number>;
  tags: string[];
  years: number[];
  today: string;
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

export default function PaperFilters({ papers, countsByDate, tags, years, today }: Props) {
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
      <PaperHeatmap countsByDate={countsByDate} selectedDate={selectedDate} today={today} onSelectDate={setSelectedDate} />

      <section className="paper-filter-panel" aria-labelledby="paper-filter-heading">
        <div className="paper-filter-panel__header">
          <div>
            <p className="eyebrow">Notebook</p>
            <h2 id="paper-filter-heading">Search and filter</h2>
          </div>
          {hasFilters ? (
            <button type="button" className="paper-filter-panel__reset" onClick={resetFilters}>
              Reset filters
            </button>
          ) : null}
        </div>

        <div className="paper-filter-grid">
          <label className="paper-field paper-field--wide">
            <span>Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <label className="paper-field">
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              {statuses.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="paper-field">
            <span>Depth</span>
            <select value={depth} onChange={(event) => setDepth(event.target.value)}>
              <option value="">All depths</option>
              {depths.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="paper-field">
            <span>Tag</span>
            <select value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="">All tags</option>
              {tags.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="paper-field">
            <span>Year</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="">All years</option>
              {years.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="paper-field">
            <span>Difficulty</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              <option value="">All levels</option>
              {[1, 2, 3, 4, 5].map((item) => (
                <option value={item} key={item}>
                  {item}/5
                </option>
              ))}
            </select>
          </label>

          <label className="paper-field">
            <span>Sort</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="latest">Latest read date</option>
              <option value="title">Title</option>
              <option value="difficulty">Difficulty</option>
              <option value="reading-time">Reading time</option>
              <option value="depth">Depth</option>
            </select>
          </label>

          <label className="paper-check">
            <input type="checkbox" checked={featuredOnly} onChange={(event) => setFeaturedOnly(event.target.checked)} />
            <span>Featured only</span>
          </label>
        </div>

        {selectedDate ? (
          <p className="paper-selected-date">
            Filtering by <strong>{selectedDate}</strong>
            <button type="button" onClick={() => setSelectedDate("")}>
              Clear date
            </button>
          </p>
        ) : null}
      </section>

      <section className="paper-results" aria-labelledby="paper-results-heading">
        <div className="paper-results__header">
          <h2 id="paper-results-heading">Paper cards</h2>
          <p>
            {filteredPapers.length} of {papers.length} shown
          </p>
        </div>

        {papers.length === 0 ? (
          <div className="paper-empty-state">
            <h3>No paper logs yet. Start with one 20-minute pass.</h3>
            <p>Begin with a short note that records the paper's question, core idea, and next reading decision.</p>
          </div>
        ) : filteredPapers.length > 0 ? (
          <div className="paper-card-list">
            {filteredPapers.map((paper) => (
              <PaperCard paper={paper} key={paper.id} />
            ))}
          </div>
        ) : (
          <div className="paper-empty-state">
            <h3>No papers match these filters.</h3>
            <p>Adjust the filters or reset them to return to the full paper log.</p>
          </div>
        )}
      </section>
    </div>
  );
}
