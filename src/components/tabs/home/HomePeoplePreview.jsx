import { Link } from "react-router-dom";
import { getHomeMediaBySection, getPeoplePreview } from "./homeData";

export default function HomePeoplePreview() {
  const members = getPeoplePreview(6);
  const cultureMediaItems = getHomeMediaBySection("culture", 2);
  const cultureMedia =
    cultureMediaItems.find((item) => item.id === "culture_discussion") ??
    cultureMediaItems[0];

  return (
    <section
      data-reveal
      data-reveal-load-delay="220"
      className="home-block home-people-preview"
      aria-labelledby="home-people-title"
    >
      <div className="home-block__head">
        <div>
          <h2 id="home-people-title">People</h2>
          <p>Meet the professor and members behind current Lab-LVM research.</p>
        </div>
      </div>

      {cultureMedia ? (
        <article data-reveal data-reveal-load-delay="140" className="home-people__culture interactive-row">
          <div className="home-people__culture-media">
            {cultureMedia.image ? (
              <img src={cultureMedia.image} alt={cultureMedia.alt || cultureMedia.title} />
            ) : (
              <div className="home-people__culture-placeholder">Image placeholder</div>
            )}
          </div>
          <div className="home-people__culture-copy">
            <p className="home-people__culture-title">Lab Culture & Environment</p>
            <p className="home-people__culture-desc">
              Group discussions, mentoring, and shared experimentation define
              the day-to-day research environment across our vision and multimodal projects.
            </p>
          </div>
          <div className="home-people__culture-actions">
            <Link to="/photo" className="home-block__more-link btn btn--tertiary animated-underline">
              View gallery
            </Link>
          </div>
        </article>
      ) : null}

      <div className="home-people__grid">
        {members.map((member, index) => (
          <article
            key={member.id}
            data-reveal
            data-reveal-load-delay={`${120 + index * 60}`}
            style={{ "--reveal-delay": `${index * 60}ms` }}
            className="home-people__card interactive-card"
          >
            <div className="home-people__photo-wrap">
              {member.image ? (
                <img src={member.image} alt={member.name} />
              ) : (
                <span>{member.name[0]}</span>
              )}
            </div>
            <div className="home-people__meta">
              <p className="home-people__name">{member.name}</p>
              <p className="home-people__role">{member.role}</p>
              {member.email ? (
                <a href={`mailto:${member.email}`} className="animated-underline">
                  {member.email}
                </a>
              ) : (
                <p className="home-people__email-empty">Email not listed</p>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="home-block__section-footer">
        <Link to="/people" className="home-block__section-action btn btn--tertiary animated-underline">
          View all people
        </Link>
      </div>
    </section>
  );
}
