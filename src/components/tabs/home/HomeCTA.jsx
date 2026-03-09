import { Link } from "react-router-dom";

export default function HomeCTA() {
  return (
    <section
      data-reveal
      data-reveal-load-delay="260"
      className="home-block home-cta"
      aria-labelledby="home-cta-title"
    >
      <div className="home-cta__content">
        <div className="home-block__head home-cta__head">
          <div>
            <h2 id="home-cta-title">Collaborate / Contact</h2>
            <p>For collaborations, student applications, and research inquiries.</p>
          </div>
        </div>
        <p className="home-cta__institution">
          We welcome collaboration, student applications, and research inquiries.
        </p>
        <p>
          Lab-LVM works with academic and industrial partners on practical
          computer vision and multimodal AI research.
        </p>
      </div>
      <div className="home-cta__actions">
        <Link
          to="/contact"
          className="home-cta__btn home-cta__btn--primary btn btn--primary interactive-button lift-on-hover"
        >
          Contact
        </Link>
      </div>
    </section>
  );
}
