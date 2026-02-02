import React, { useRef, useState, useEffect } from "react";
import MORE_IMG from "../../assets/icons/Circle Chevron Down Icon.svg";

function HomeResearchCard({
  handleActiveResearch,
  title,
  subtitle,
  image,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.7,
      },
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const topic = title.split(" ")[0].toLowerCase();

  const setTopic = () => {
    handleActiveResearch(topic);
  };

  const cardBackgroundStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(247, 249, 255, 0.22), rgba(247, 249, 255, 0.5)), url(${image})`,
    backgroundRepeat: "no-repeat",
    position: "relative",
    backgroundPosition: "center",
    backgroundSize: "cover",
  };

  return (
    <div
      className={`home-research__card home-research__card--${topic} is-reveal ${isVisible ? "is-visible" : ""}`}
      style={cardBackgroundStyle}
      ref={cardRef}
    >
      <div className="home-research__card-content">
        <button
          type="button"
          className="home-research__card-btn"
          onClick={setTopic}
        >
          <img src={MORE_IMG} alt="" />
        </button>
        <h1 className="home-research__card-title">{title}</h1>
        <div className="home-research__card-subtitle">
          {subtitle.map((subtitleItem, i) => {
            return <p key={i}>{subtitleItem}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

export default HomeResearchCard;
