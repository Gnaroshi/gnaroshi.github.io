import "./Research.css";
import ResearchCard from "./Research.Card";
import CONTENTS from "../../assets/dataset/performance_management.json";

function Research({ selectedResearchTopic }) {
  const researchContents = Object.values(CONTENTS.contents)
    .map((contentItem) => ({
      ...contentItem,
      topicKey: contentItem.title.split(" ")[0].toLowerCase(),
    }))
    .sort((a, b) => {
      if (a.topicKey === selectedResearchTopic) return -1;
      if (b.topicKey === selectedResearchTopic) return 1;
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="research-wrapper">
      <div className="tab-header">
        <h1>Research Area</h1>
      </div>
      <div className="research-card-wrapper">
        {researchContents.map((contentItem) => (
          <ResearchCard
            key={contentItem.topicKey}
            {...contentItem}
            isSelected={contentItem.topicKey === selectedResearchTopic}
          />
        ))}
      </div>
    </div>
  );
}
export default Research;
