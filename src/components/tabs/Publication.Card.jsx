import CORE_IMG from "../../assets/images/research_concepts/core.png";

function PublicationCard({ category, meta, title }) {
  return (
    <div className="publication__card">
      <div className="publication__card-image">
        <img src={CORE_IMG} alt="" />
      </div>

      <div className={`publication__card-divider publication__card-divider--${category}`}></div>

      <div className="publication__card-info">
        <div className="publication__card-title">
          <a href={meta.paper_link}>
            <p>{title}</p>
          </a>
        </div>
        <div className="publication__card-publish">
          <p className="publication__card-published-place">
            {meta.published_date}
          </p>
          <p>{meta.published_place}</p>
        </div>
        <div className="publication__card-author">
          <p>{meta.author}</p>
        </div>
      </div>
    </div>
  );
}

export default PublicationCard;
