import RESEARCH_IMAGES from "../../assets/images/research_concepts/research_concepts_image_index";

const CATEGORY_META = {
  application: { label: "Application" },
  biomedical: { label: "Biomedical" },
  core: { label: "Core" },
  "multi-modal": { label: "Multi-modal" },
};

const CATEGORY_IMAGE = {
  application: RESEARCH_IMAGES.application_ai_img,
  biomedical: RESEARCH_IMAGES.biomedical_ai_img,
  core: RESEARCH_IMAGES.core_ai_img,
  "multi-modal": RESEARCH_IMAGES["multi-modal_ai_img"],
};

const isValidHttpUrl = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

function PublicationCard({
  category,
  meta,
  title,
  revealDelay = "0ms",
  revealLoadDelay = "80",
}) {
  const paperLink = meta.paper_link?.trim();
  const hasPaperLink = isValidHttpUrl(paperLink);
  const categoryMeta = CATEGORY_META[category] ?? CATEGORY_META["multi-modal"];
  const categoryImage = CATEGORY_IMAGE[category] ?? CATEGORY_IMAGE["multi-modal"];
  const authorText = meta.author?.trim() ?? "";
  const venueText = meta.published_place?.trim() ?? "";
  const dateText = meta.published_date?.trim() ?? "";

  return (
    <article
      data-reveal
      data-reveal-load-delay={revealLoadDelay}
      style={{ "--reveal-delay": revealDelay }}
      className="publication__card"
    >
      <div className="publication__card-media">
        {categoryImage ? (
          <img src={categoryImage} alt={`${categoryMeta.label} publication visual`} />
        ) : (
          <div className="publication__card-media-placeholder">Image placeholder</div>
        )}
      </div>
      <div className="publication__card-main">
        <div className="publication__card-badges">
          <p className={`publication__card-badge publication__card-badge--${category}`}>
            {categoryMeta.label}
          </p>
        </div>
        <h3 className="publication__card-title">
          {hasPaperLink ? (
            <a
              href={paperLink}
              target="_blank"
              rel="noreferrer"
              className="publication__card-title-link animated-underline"
            >
              {title}
            </a>
          ) : (
            <span className="publication__card-title-link publication__card-title-link--muted">
              {title}
            </span>
          )}
        </h3>

        {authorText ? <p className="publication__card-author">{authorText}</p> : null}
        {(venueText || dateText) && (
          <p className="publication__card-meta-line">
            {venueText ? <span className="publication__card-venue">{venueText}</span> : null}
            {dateText ? <span className="publication__card-date">{dateText}</span> : null}
          </p>
        )}
      </div>
      <div className="publication__card-side">
        {hasPaperLink ? (
          <a
            href={paperLink}
            target="_blank"
            rel="noreferrer"
            className="publication__card-action-link btn btn--secondary btn--sm interactive-button"
          >
            Open paper ↗
          </a>
        ) : (
          <span className="publication__card-action-link publication__card-action-link--muted">
            Internal archive
          </span>
        )}
      </div>
    </article>
  );
}

export default PublicationCard;
