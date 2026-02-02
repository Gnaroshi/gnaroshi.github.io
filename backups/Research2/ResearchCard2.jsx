import "./ResearchCard2.css";

function ResearchCard2({ title, subtitle, explaination, tags }) {
  return (
    <div id="research-card" className="research-flex1">
      <h1 id="research-card-title">{title}</h1>
      {/* <p id="research-card-subtitle">{subtitle}</p> */}
      <div id="research-card-subtitle" className="research-flex2">
        {subtitle.map((subtitleItem, i) => {
          return <p key={i}>{subtitleItem}</p>;
        })}
      </div>
      <div id="research-card-explaination" className="research-flex2">
        <p>{explaination}</p>
      </div>
      <div id="research-card-tags" className="research-flex2">
        {tags.map((tagItem, i) => {
          return <p key={i}>{tagItem}</p>;
        })}
      </div>
    </div>
  );
}

export default ResearchCard2;
