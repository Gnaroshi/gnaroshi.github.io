import "./HomeResearch.css";
import HomeResearchCard from "./HomeResearch.Card";
import CONTENTS from "../../assets/dataset/performance_management.json";
import CONTENT_IMGS from "../../assets/images/research_concepts/research_concepts_image_index.js";
import { Link } from "react-router-dom";

function HomeResearch({ handleActiveResearch }) {
  const researchContents = Object.entries(CONTENTS.contents).map(
    ([key, value]) => ({
      ...value,
      image: CONTENT_IMGS[`${key}_img`],
    }),
  );

  return (
    <div className="home-research">
      <div data-reveal className="home-block__head home-research__header">
        <div>
          <h2>Research Areas</h2>
          <p>Concise topic previews that route into the full Research page.</p>
        </div>
        <Link to="/research" className="home-block__more-link btn btn--tertiary animated-underline">
          View all research
        </Link>
      </div>
      <div className="home-research__grid">
        {researchContents.map((contentItem, index) => (
          <HomeResearchCard
            handleActiveResearch={handleActiveResearch}
            key={contentItem.title}
            revealDelay={`${index * 70}ms`}
            revealLoadDelay={`${120 + index * 70}`}
            {...contentItem}
          />
        ))}
      </div>
    </div>
  );
}

export default HomeResearch;
