import "./HomeResearchCard.css";

function HomeResearchCard({ title, subtitle, explaination, tags }) {
  return (
    <div id="home-research-card" className="home-flex1">
      <h1 id="home-research-card-title">{title}</h1>
      {/* <p id="home-research-card-subtitle">{subtitle}</p> */}
      <div id="home-research-card-subtitle" className="home-flex2">
        {subtitle.map((subtitleItem, i) => {
          return <p key={i}>{subtitleItem}</p>;
        })}
      </div>
      <div id="home-research-card-explaination" className="home-flex2">
        <p>{explaination}</p>
      </div>
      <div id="home-research-card-tags" className="home-flex2">
        {tags.map((tagItem, i) => {
          return <p key={i}>{tagItem}</p>;
        })}
      </div>
    </div>
  );
}

export default HomeResearchCard;
