import "./Home.Introduction.css";
import { getHomeMediaBySection } from "./home/homeData";

const RESEARCH_FOCUS = [
  "Computer Vision",
  "Multimodal AI",
  "Biomedical AI",
  "Real-world AI",
];

function HomeIntroduction() {
  const mediaItems = getHomeMediaBySection("introduction", 2);
  const featuredMedia = mediaItems[0];
  const supportingMedia = mediaItems[1];

  return (
    <div className="home-introduction">
      <div data-reveal data-reveal-load-delay="170" className="home-introduction__copy">
        <div className="home-block__head home-introduction__head">
          <div>
            <h2>Welcome</h2>
            <p>Computer vision and multimodal AI research for real-world impact.</p>
          </div>
        </div>
        <p className="home-introduction__lead">
          Lab-LVM advances computer vision and multimodal AI through foundational
          methods and domain-focused applications.
        </p>
        <p className="home-introduction__body">
          We work on a broad range of machine learning problems with a strong
          focus on computer vision. Our research includes large-scale vision
          models and multimodal methods that combine vision, language, and speech.
          We apply these models to practical challenges in diverse domains,
          including industrial and medical data.
        </p>
        <div className="home-introduction__focus" aria-label="Lab research focus">
          {RESEARCH_FOCUS.map((item) => (
            <span key={item} className="home-introduction__focus-chip">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div data-reveal data-reveal-load-delay="210" className="home-introduction__media">
        <figure
          data-reveal
          data-reveal-load-delay="240"
          className="home-introduction__figure home-introduction__figure--featured"
        >
          {featuredMedia?.image ? (
            <img src={featuredMedia.image} alt={featuredMedia.alt || featuredMedia.title} />
          ) : (
            <div className="home-introduction__placeholder">Image placeholder</div>
          )}
          {featuredMedia ? (
            <figcaption>
              <strong>{featuredMedia.title}</strong>
              <span>{featuredMedia.description}</span>
            </figcaption>
          ) : null}
        </figure>
        {supportingMedia ? (
          <figure
            data-reveal
            data-reveal-load-delay="280"
            className="home-introduction__figure home-introduction__figure--support"
          >
            {supportingMedia.image ? (
              <img src={supportingMedia.image} alt={supportingMedia.alt || supportingMedia.title} />
            ) : (
              <div className="home-introduction__placeholder">Image placeholder</div>
            )}
            <figcaption>
              <strong>{supportingMedia.title}</strong>
              <span>
                {supportingMedia.description ||
                  "Editorial media slot prepared for future homepage updates."}
              </span>
            </figcaption>
          </figure>
        ) : null}
      </div>
    </div>
  );
}

export default HomeIntroduction;
