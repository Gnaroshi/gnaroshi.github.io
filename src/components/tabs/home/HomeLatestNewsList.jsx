import { Link } from "react-router-dom";
import {
  formatNewsDate,
  getLatestNews,
  getNewsTypeMeta,
  isValidHttpUrl,
} from "./homeData";

const isNonEmpty = (value) => typeof value === "string" && value.trim().length > 0;

const createPrefixedHeadline = (title, prefix, existingPrefixPattern) => {
  const normalizedTitle = isNonEmpty(title) ? title.trim() : "";
  if (!normalizedTitle) {
    return prefix;
  }

  if (existingPrefixPattern.test(normalizedTitle)) {
    return normalizedTitle;
  }

  return `${prefix}: ${normalizedTitle}`;
};

const createHomeNewsCopy = (item) => {
  const summary = isNonEmpty(item.summary) ? item.summary.trim() : "";
  const venue = isNonEmpty(item.venue) ? item.venue.trim() : "";
  const person = isNonEmpty(item.related_person) ? item.related_person.trim() : "";
  const yearText = item.year ? String(item.year) : "";
  const venueWithYear = venue && yearText && !venue.includes(yearText)
    ? `${venue} ${yearText}`
    : venue || yearText;

  switch (item.type) {
    case "paper_accepted":
      return {
        headline: createPrefixedHeadline(
          item.title,
          "Paper Accepted",
          /^paper\s+accepted/i,
        ),
        meta: venueWithYear || summary,
      };
    case "new_member":
      return {
        headline: createPrefixedHeadline(
          person || item.title,
          "New Member Joined",
          /^(new\s+(intern|member)|intern\s+joined|member\s+joined)/i,
        ),
        meta: summary || venue,
      };
    case "graduation":
      return {
        headline: createPrefixedHeadline(
          person || item.title,
          "Graduation Congratulations",
          /^(graduation|congratulations)/i,
        ),
        meta: summary || venue,
      };
    case "equipment":
      return {
        headline: createPrefixedHeadline(
          item.title,
          "New Equipment Installed",
          /^(new\s+equipment|equipment|installed)/i,
        ),
        meta: summary || venue,
      };
    case "seminar":
    case "workshop":
      return {
        headline: createPrefixedHeadline(
          item.title,
          "Seminar / Talk",
          /^(seminar|talk|workshop)/i,
        ),
        meta: venueWithYear || summary,
      };
    case "award":
      return {
        headline: createPrefixedHeadline(
          item.title,
          "Award / Achievement",
          /^(award|achievement|best)/i,
        ),
        meta: venueWithYear || summary,
      };
    case "visit":
      return {
        headline: createPrefixedHeadline(
          item.title,
          "Visit / Collaboration Update",
          /^(visit|collaboration)/i,
        ),
        meta: summary || venue,
      };
    default:
      return {
        headline: item.title,
        meta: [venueWithYear, summary].filter(Boolean).join(" · "),
      };
  }
};

export default function HomeLatestNewsList() {
  const newsItems = getLatestNews(5);

  return (
    <section
      data-reveal
      data-reveal-load-delay="180"
      className="home-block home-news"
      aria-labelledby="home-news-title"
    >
      <div className="home-block__head">
        <div>
          <h2 id="home-news-title">Latest News</h2>
          <p>Recent lab updates across research, people, seminars, and achievements.</p>
        </div>
      </div>

      <div className="home-news__list">
        {newsItems.map((item, index) => {
          const isExternal = item.is_external && isValidHttpUrl(item.external_url);
          const internalTarget = item.internal_slug ? `/news#${item.internal_slug}` : "/news";
          const revealDelay = `${index * 60}ms`;
          const revealLoadDelay = `${120 + index * 60}`;
          const typeLabel = getNewsTypeMeta(item.type).label;
          const statusLabel = isExternal ? "External" : "Lab update";
          const { headline, meta } = createHomeNewsCopy(item);
          const commonProps = {
            "data-reveal": true,
            "data-reveal-load-delay": revealLoadDelay,
            style: { "--reveal-delay": revealDelay },
            className: "home-news__row home-news__row--link interactive-row is-clickable",
          };

          const rowContent = (
            <>
              <p className="home-news__date">{formatNewsDate(item.date)}</p>
              <div className="home-news__body">
                <div className="home-news__badges">
                  <p className="home-news__badge home-news__badge--type">{typeLabel}</p>
                  <p className={`home-news__badge home-news__badge--status ${isExternal ? "is-external" : ""}`}>
                    {statusLabel}
                  </p>
                </div>
                <p className="home-news__headline interactive-row__title animated-underline">
                  {headline}
                </p>
                {meta ? <p className="home-news__meta">{meta}</p> : null}
              </div>
              <span className="home-news__action" aria-hidden="true">
                <span className="home-news__action-label">{isExternal ? "Open" : "News"}</span>
                <span className="home-news__arrow interactive-row__arrow">→</span>
              </span>
            </>
          );

          if (isExternal) {
            return (
              <a
                key={item.id}
                {...commonProps}
                href={item.external_url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${headline} (opens external link)`}
              >
                {rowContent}
              </a>
            );
          }

          return (
            <Link
              key={item.id}
              {...commonProps}
              to={internalTarget}
              aria-label={`${headline} (view in news archive)`}
            >
              {rowContent}
            </Link>
          );
        })}
      </div>

      <div className="home-block__section-footer">
        <Link to="/news" className="home-block__section-action btn btn--tertiary animated-underline">
          View all news
        </Link>
      </div>
    </section>
  );
}
