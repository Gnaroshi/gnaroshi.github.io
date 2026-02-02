import "./Research.Card.css";

function ResearchCard({ title, subtitle, explaination, tags, topicKey, isSelected }) {
  const subtitleNormalized = new Set(
    subtitle.map((item) => item.toLowerCase().replace(/\s+/g, " ").trim()),
  );
  const dedupedTags = tags.filter(
    (item) => !subtitleNormalized.has(item.toLowerCase().replace(/\s+/g, " ").trim()),
  );

  return (
    <article
      className={`research-card research-card--${topicKey} ${isSelected ? "is-selected" : ""}`}
    >
      <h1 className="research-card-title">{title}</h1>
      <div className="research-card-content-wrapper">
        <div className="research-card-chip-row research-card-subtitle">
          {subtitle.map((subtitleItem, i) => {
            return <p key={i}>{subtitleItem}</p>;
          })}
        </div>
        <div className="research-card-description">
          <p>{explaination}</p>
        </div>
        <div className="research-card-chip-row research-card-tags">
          {dedupedTags.map((tagItem, i) => {
            return <p key={i}>{tagItem}</p>;
          })}
        </div>
      </div>
    </article>
  );
}

export default ResearchCard;
