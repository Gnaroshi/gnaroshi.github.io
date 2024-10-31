import "./Research.css";
import ResearchCard from "./Research/ResearchCard.jsx";
import CONTENTS from "../../assets/dataset/performance_management.json";

function Research() {
  const RESEARCH_CONTENTS = Object.values(CONTENTS.contents);

  return (
    <div id="research-wrapper">
      <h1>Research Area</h1>

      <div id="research-card-wrapper">
        {RESEARCH_CONTENTS.map((contentItem, i) => (
          <ResearchCard key={i} {...contentItem} />
        ))}
      </div>
      {/* <HomeResearchCard {...HOME_CONTENTS.core_ai} /> */}
    </div>
  );
}

export default Research;
