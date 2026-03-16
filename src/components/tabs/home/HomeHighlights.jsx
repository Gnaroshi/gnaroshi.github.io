import { Link } from "react-router-dom";
import HOME_MEDIA_IMAGES from "../../../assets/images/home/home_media_index";
import { computeCounts } from "./homeData";

const CARD_META = [
  {
    key: "researchAreas",
    label: "Research Areas",
    caption: "Core · Multi-modal · Biomedical · Application",
    to: "/research",
    imageKey: "research_environment",
    alt: "Lab research environment",
  },
  {
    key: "publications",
    label: "Publications",
    caption: "Published items listed in this website",
    to: "/publication",
    imageKey: "culture_discussion",
    alt: "Collaborative research discussion",
  },
  {
    key: "members",
    label: "Members",
    caption: "Professor, students, interns, and alumni",
    to: "/people",
    imageKey: "intro_group_photo",
    alt: "Lab members group photo",
  },
  {
    key: "latestNews",
    label: "Latest News",
    caption: "Recent announcements available on Home",
    to: "/news",
    imageKey: "culture_seminar",
    alt: "Seminar and activity snapshot",
  },
];

export default function HomeHighlights() {
  const counts = computeCounts();

  return (
    <section
      data-reveal
      data-reveal-load-delay="100"
      className="home-block home-highlights"
      aria-labelledby="home-highlights-title"
    >
      <div className="home-block__head">
        <div>
          <h2 id="home-highlights-title">Highlights</h2>
          <p>At-a-glance overview of Lab-LVM activity.</p>
        </div>
      </div>

      <div className="home-highlights__grid">
        {CARD_META.map((item, index) => {
          const revealDelay = `${index * 60}ms`;
          const revealLoadDelay = `${80 + index * 60}`;
          const imageSrc = HOME_MEDIA_IMAGES[item.imageKey] ?? null;
          const body = (
            <>
              <div className="home-highlights__media">
                {imageSrc ? (
                  <img src={imageSrc} alt={item.alt || item.label} />
                ) : (
                  <div className="home-highlights__media-placeholder">Image placeholder</div>
                )}
              </div>
              <p className="home-highlights__value">{counts[item.key]}</p>
              <p className="home-highlights__label">{item.label}</p>
              <p className="home-highlights__caption">{item.caption}</p>
            </>
          );

          if (item.to) {
            return (
              <Link
                key={item.key}
                to={item.to}
                data-reveal
                data-reveal-load-delay={revealLoadDelay}
                style={{ "--reveal-delay": revealDelay }}
                className={`home-highlights__card home-highlights__card--${item.key} interactive-card is-clickable`}
              >
                {body}
              </Link>
            );
          }

          return (
            <article
              key={item.key}
              data-reveal
              data-reveal-load-delay={revealLoadDelay}
              style={{ "--reveal-delay": revealDelay }}
              className={`home-highlights__card home-highlights__card--${item.key} interactive-card`}
            >
              {body}
            </article>
          );
        })}
      </div>
    </section>
  );
}
