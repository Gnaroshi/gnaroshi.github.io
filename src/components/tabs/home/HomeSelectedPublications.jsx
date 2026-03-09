import { Link } from "react-router-dom";
import { getLatestPublications, isValidHttpUrl } from "./homeData";

const CATEGORY_LABELS = {
  application: "Application",
  biomedical: "Biomedical",
  core: "Core",
  "multi-modal": "Multimodal",
};

const formatPublicationVenue = (item) => {
  const venue = item.research_meta.published_place?.trim();
  const date = item.research_meta.published_date?.trim();
  return [venue, date].filter(Boolean).join(" · ");
};

export default function HomeSelectedPublications() {
  const publications = getLatestPublications(4);
  const [featuredPublication, ...previewPublications] = publications;

  if (!featuredPublication) {
    return null;
  }

  const featuredPaperLink = featuredPublication.research_meta.paper_link?.trim();
  const hasFeaturedExternalLink = isValidHttpUrl(featuredPaperLink);
  const featuredQueryTarget = `/publication?q=${encodeURIComponent(featuredPublication.title)}&scope=title`;
  const featuredCategoryLabel =
    CATEGORY_LABELS[featuredPublication.category] ?? featuredPublication.category;

  return (
    <section
      data-reveal
      data-reveal-load-delay="140"
      className="home-block home-selected-publications"
      aria-labelledby="home-selected-publications-title"
    >
      <div className="home-block__head">
        <div>
          <h2 id="home-selected-publications-title">Publications</h2>
          <p>
            Editorial preview of recent work with direct access to the full publication archive.
          </p>
        </div>
        <div className="home-block__actions">
          <Link
            to="/publication?scope=title-authors"
            className="home-block__more-link btn btn--tertiary animated-underline"
          >
            Search publications
          </Link>
          <Link to="/publication" className="home-block__more-link btn btn--tertiary animated-underline">
            View all publications
          </Link>
        </div>
      </div>

      <article
        data-reveal
        data-reveal-load-delay="160"
        className="home-pubs__featured interactive-card"
      >
        <div className="home-pubs__featured-main">
          <p className="home-pubs__featured-kicker">Featured publication</p>
          <div className="home-pubs__featured-top">
            <p className={`home-pubs__badge home-pubs__badge--${featuredPublication.category}`}>
              {featuredCategoryLabel}
            </p>
            <p className="home-pubs__featured-venue">{formatPublicationVenue(featuredPublication)}</p>
          </div>
          <h3 className="home-pubs__featured-title">
            {hasFeaturedExternalLink ? (
              <a href={featuredPaperLink} target="_blank" rel="noreferrer">
                <span className="animated-underline">{featuredPublication.title}</span>
              </a>
            ) : (
              <Link to={featuredQueryTarget}>
                <span className="animated-underline">{featuredPublication.title}</span>
              </Link>
            )}
          </h3>
          <p className="home-pubs__featured-authors">{featuredPublication.research_meta.author}</p>
        </div>
        <div className="home-pubs__featured-actions">
          {hasFeaturedExternalLink ? (
            <a
              href={featuredPaperLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn--secondary btn--sm interactive-button"
            >
              Open paper ↗
            </a>
          ) : null}
        </div>
      </article>

      <div className="home-pubs__list-head">
        <p className="home-pubs__list-kicker">More recent publications</p>
        <p className="home-pubs__list-caption">Additional curated items from the publication archive.</p>
      </div>

      <div className="home-pubs__list">
        {previewPublications.map((item, index) => {
          const paperLink = item.research_meta.paper_link?.trim();
          const isExternal = isValidHttpUrl(paperLink);
          const revealDelay = `${index * 60}ms`;
          const revealLoadDelay = `${200 + index * 60}`;
          const queryTarget = `/publication?q=${encodeURIComponent(item.title)}&scope=title`;
          const rowClassName = "home-pubs__row home-pubs__row--link interactive-row";
          const rowContent = (
            <>
              <p className={`home-pubs__badge home-pubs__badge--${item.category}`}>
                {CATEGORY_LABELS[item.category] || item.category}
              </p>
              <div className="home-pubs__meta">
                <p className="home-pubs__title interactive-row__title animated-underline">{item.title}</p>
                <p>{formatPublicationVenue(item)}</p>
              </div>
              <span className="home-pubs__arrow interactive-row__arrow" aria-hidden="true">
                →
              </span>
            </>
          );

          if (isExternal) {
            return (
              <a
                key={item.key}
                data-reveal
                data-reveal-load-delay={revealLoadDelay}
                style={{ "--reveal-delay": revealDelay }}
                className={rowClassName}
                href={paperLink}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open publication: ${item.title}`}
              >
                {rowContent}
              </a>
            );
          }

          return (
            <Link
              key={item.key}
              data-reveal
              data-reveal-load-delay={revealLoadDelay}
              style={{ "--reveal-delay": revealDelay }}
              className={rowClassName}
              to={queryTarget}
              aria-label={`Search related publications: ${item.title}`}
            >
              {rowContent}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
