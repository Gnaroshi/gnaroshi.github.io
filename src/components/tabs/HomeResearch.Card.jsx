function HomeResearchCard({
  handleActiveResearch,
  title,
  subtitle,
  image,
  revealDelay,
  revealLoadDelay,
}) {
  const topic = title.split(" ")[0].toLowerCase();

  const setTopic = () => {
    handleActiveResearch(topic);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setTopic();
    }
  };

  const mediaStyle = {
    backgroundImage: `url(${image})`,
  };

  return (
    <article
      data-reveal
      data-reveal-load-delay={revealLoadDelay}
      style={{ "--reveal-delay": revealDelay }}
      className={`home-research__card home-research__card--${topic} interactive-card`}
      role="button"
      tabIndex={0}
      onClick={setTopic}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${title} research area`}
    >
      <div className="home-research__card-media" style={mediaStyle}></div>
      <div className="home-research__card-content">
        <h1 className="home-research__card-title">{title}</h1>
        <div className="home-research__card-subtitle" aria-label={`${title} topic tags`}>
          {subtitle.slice(0, 2).map((subtitleItem, i) => (
            <p key={i}>{subtitleItem}</p>
          ))}
        </div>
        <div className="home-research__card-footer">
          <p className="home-research__card-cta animated-underline">Explore area →</p>
        </div>
      </div>
    </article>
  );
}

export default HomeResearchCard;
