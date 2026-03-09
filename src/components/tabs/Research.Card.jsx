import { Link } from "react-router-dom";
import { getResearchAreaPalette } from "../../utils/researchAreaColors";
import "./Research.Card.css";

function ResearchCard({
  title,
  subtitle = [],
  explaination,
  tags = [],
  topicKey,
  publicationCategory,
  hasPublicationCategory = true,
  publicationCount = 0,
  image = null,
  isSelected,
  revealDelay = "0ms",
  revealLoadDelay = "80",
}) {
  const palette = getResearchAreaPalette(publicationCategory || topicKey);
  const subtitleNormalized = new Set(
    subtitle.map((item) => item.toLowerCase().replace(/\s+/g, " ").trim()),
  );
  const dedupedTags = tags.filter(
    (item) => !subtitleNormalized.has(item.toLowerCase().replace(/\s+/g, " ").trim()),
  );
  const subtitleText = subtitle.join(" · ");
  const publicationCountText = publicationCount
    ? `${publicationCount} related publication${publicationCount === 1 ? "" : "s"}`
    : "No related publications listed yet";
  const publicationLink = hasPublicationCategory
    ? `/publication?area=${encodeURIComponent(
        publicationCategory,
      )}&scope=title-authors`
    : `/publication?q=${encodeURIComponent(title)}&scope=title-authors`;

  return (
    <article
      data-reveal
      data-reveal-load-delay={revealLoadDelay}
      style={{
        "--reveal-delay": revealDelay,
        "--topic-tint": palette.tint,
        "--topic-border": palette.border,
        "--topic-accent": palette.accent,
      }}
      className={`research-card research-card--${topicKey} interactive-card ${isSelected ? "is-selected" : ""}`}
    >
      <div className="research-card-media">
        {image ? (
          <img src={image} alt={`${title} representative visual`} />
        ) : (
          <div className="research-card-media-placeholder">Image placeholder</div>
        )}
      </div>

      <div className="research-card-content-wrapper">
        <div className="research-card-head">
          <h2 className="research-card-title">{title}</h2>
          {subtitleText ? (
            <div className="research-card-subtitle-wrap">
              <p className="research-card-subtitle-label">Positioning</p>
              <p className="research-card-subtitle">{subtitleText}</p>
            </div>
          ) : null}
        </div>

        <p className="research-card-description">{explaination}</p>

        {dedupedTags.length > 0 ? (
          <div className="research-card-metadata">
            <p className="research-card-metadata-label">Keywords</p>
            <div className="research-card-tags">
              {dedupedTags.map((tagItem, i) => (
                <span key={i} className="research-card-tag">
                  {tagItem}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="research-card-footer">
          <p className="research-card-publication-meta">{publicationCountText}</p>
          <div className="research-card-actions">
            <Link
              to={publicationLink}
              className="research-card-action research-card-action--primary btn btn--secondary btn--sm interactive-button"
            >
              Related publications
            </Link>
            <Link
              to="/people"
              className="research-card-action research-card-action--secondary btn btn--tertiary animated-underline"
            >
              Related researchers
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ResearchCard;
