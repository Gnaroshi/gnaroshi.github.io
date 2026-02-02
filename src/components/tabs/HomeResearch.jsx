import "./HomeResearch.css";
import HomeResearchCard from "./HomeResearch.Card";
import CONTENTS from "../../assets/dataset/performance_management.json";
import CONTENT_IMGS from "../../assets/images/research_concepts/research_concepts_image_index.js";

function HomeResearch({ handleActiveResearch }) {
  const researchContents = Object.entries(CONTENTS.contents).map(
    ([key, value]) => ({
      ...value,
      image: CONTENT_IMGS[`${key}_img`],
    }),
  );
  return (
    <div className="home-research">
      <div className="home-research__header">
        <h2>Our Research Area</h2>
        <p>Explore the four focus areas of Lab-LVM.</p>
      </div>
      <div className="home-research__grid">
        {researchContents.map((contentItem) => (
          <HomeResearchCard
            handleActiveResearch={handleActiveResearch}
            key={contentItem.title}
            {...contentItem}
          />
        ))}
      </div>
    </div>
  );
}

export default HomeResearch;
