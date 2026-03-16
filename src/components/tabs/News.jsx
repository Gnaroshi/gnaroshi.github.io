import { useMemo, useState } from "react";
import {
  formatNewsDate,
  getAllNewsItems,
  getNewsTypeMeta,
  getNewsTypes,
  isValidExternalUrl,
} from "../../utils/newsData";
import "./News.css";

function News() {
  const [selectedType, setSelectedType] = useState("all");
  const allNewsItems = useMemo(() => getAllNewsItems(), []);

  const filteredNewsItems = useMemo(() => {
    if (selectedType === "all") {
      return allNewsItems;
    }

    return allNewsItems.filter((item) => item.type === selectedType);
  }, [allNewsItems, selectedType]);

  const groupedByYear = useMemo(() => {
    const groups = new Map();

    filteredNewsItems.forEach((item) => {
      const yearLabel = String(item.year || new Date(item.date).getFullYear());
      if (!groups.has(yearLabel)) {
        groups.set(yearLabel, []);
      }

      groups.get(yearLabel).push(item);
    });

    return Array.from(groups.entries()).map(([year, items]) => ({ year, items }));
  }, [filteredNewsItems]);
  const yearOptions = useMemo(
    () => groupedByYear.map((group) => group.year),
    [groupedByYear],
  );

  const typeOptions = useMemo(() => getNewsTypes(), []);

  return (
    <section data-reveal data-reveal-load-delay="60" className="news-page">
      <div data-reveal className="tab-header">
        <h1>News</h1>
      </div>

      <div data-reveal className="news-page__controls">
        <div className="news-page__controls-top">
          <p className="news-page__intro">
            Archive of papers, seminars, member updates, infrastructure milestones,
            and collaboration activities.
          </p>
        </div>
        <div className="news-page__filters" role="group" aria-label="Filter news by type">
          {typeOptions.map((type) => (
            <button
              key={type}
              type="button"
              className={`news-page__filter-btn btn btn--secondary btn--sm interactive-button ${selectedType === type ? "is-active" : ""}`}
              onClick={() => setSelectedType(type)}
              aria-pressed={selectedType === type}
            >
              {getNewsTypeMeta(type).label}
            </button>
          ))}
        </div>
      </div>

      {yearOptions.length > 0 ? (
        <nav
          data-reveal
          data-reveal-load-delay="70"
          id="news-year-nav"
          className="news-page__year-nav"
          aria-label="Jump to news year"
        >
          <p className="news-page__year-nav-label">Jump to year</p>
          <div className="news-page__year-nav-list">
            {yearOptions.map((year) => (
              <a
                key={year}
                href={`#news-year-${year}`}
                className="news-page__year-link btn btn--secondary btn--sm interactive-button"
                aria-label={`Jump to ${year} news`}
              >
                {year}
              </a>
            ))}
          </div>
        </nav>
      ) : null}

      <div className="news-page__archive">
        {groupedByYear.map((group, groupIndex) => (
          <section
            key={group.year}
            data-reveal
            data-reveal-load-delay={`${80 + Math.min(groupIndex, 3) * 50}`}
            className="news-page__year-group"
            aria-labelledby={`news-year-${group.year}`}
          >
            <h2 id={`news-year-${group.year}`} className="news-page__year-heading">
              {group.year}
            </h2>
            <div className="news-page__list">
              {group.items.map((item, index) => {
                const hasExternalLink =
                  item.is_external && isValidExternalUrl(item.external_url);
                const newsTypeMeta = getNewsTypeMeta(item.type);
                const statusLabel = hasExternalLink ? "External" : "Lab update";
                const details = [item.venue, item.related_person]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <article
                    key={item.id}
                    id={item.internal_slug || item.id}
                    data-reveal
                    data-reveal-load-delay={`${120 + Math.min(index, 5) * 60}`}
                    style={{ "--reveal-delay": `${Math.min(index, 5) * 60}ms` }}
                    className="news-page__item"
                  >
                    <p className="news-page__date">{formatNewsDate(item.date)}</p>
                    <div className="news-page__content">
                      <div className="news-page__badges">
                        <p className="news-page__badge news-page__badge--type">{newsTypeMeta.label}</p>
                        <p className={`news-page__badge news-page__badge--status ${hasExternalLink ? "is-external" : ""}`}>
                          {statusLabel}
                        </p>
                      </div>
                      <h3 className="news-page__title">{item.title}</h3>
                      <p className="news-page__summary">{item.summary}</p>
                      {details ? <p className="news-page__details">{details}</p> : null}
                    </div>
                    <div className="news-page__action">
                      {hasExternalLink ? (
                        <a
                          href={item.external_url}
                          target="_blank"
                          rel="noreferrer"
                          className="news-page__action-link btn btn--tertiary animated-underline"
                        >
                          <span>Open</span>
                          <span className="news-page__action-arrow">↗</span>
                        </a>
                      ) : (
                        <span className="news-page__action-placeholder" aria-hidden="true"></span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        {groupedByYear.length === 0 ? (
          <p className="news-page__empty">No news items in this category yet.</p>
        ) : null}
      </div>
    </section>
  );
}

export default News;
