import "./Publication.css";
import PublicationCard from "./Publication.Card";
import AA from "../../assets/dataset/application_ai.json";
import BA from "../../assets/dataset/biomedical_ai.json";
import CA from "../../assets/dataset/core_ai.json";
import MMA from "../../assets/dataset/multi-modal_ai.json";
import { useState } from "react";
import PublicationButton from "./Publication.Button";

const AA_PUB = AA.published;
const BA_PUB = BA.published;
const CA_PUB = CA.published;
const MMA_PUB = MMA.published;
const DATASET_BY_CATEGORY = {
  application: AA_PUB,
  biomedical: BA_PUB,
  core: CA_PUB,
  "multi-modal": MMA_PUB,
};

const areaCategory = [
  "all",
  ...Object.entries(DATASET_BY_CATEGORY)
    .filter(([, dataset]) => Object.keys(dataset).length !== 0)
    .map(([category]) => category),
];

const inferCategoryFromKey = (key) => {
  if (key.startsWith("aa")) return "application";
  if (key.startsWith("ba")) return "biomedical";
  if (key.startsWith("ca")) return "core";
  if (key.startsWith("mma")) return "multi-modal";
  return "all";
};

const publications = Object.entries({
  ...AA_PUB,
  ...BA_PUB,
  ...CA_PUB,
  ...MMA_PUB,
})
  .map(([key, value]) => ({
    ...value,
    category: inferCategoryFromKey(key),
  }))
  .sort((a, b) => {
  const dateA = new Date(a.research_meta.published_date);
  const dateB = new Date(b.research_meta.published_date);
  return dateB - dateA;
  });

function Publication() {
  const [selectedArea, setSelectedArea] = useState("all");

  const handleSelectedArea = (selectedArea) => {
    setSelectedArea(selectedArea);
  };

  return (
    <div className="publication">
      <div className="tab-header">
        <h1>Publication</h1>
      </div>
      <div className="publication__filter">
        {areaCategory.map((area, i) => (
          <PublicationButton
            key={area + i}
            isSelected={selectedArea === area}
            onSelect={() => handleSelectedArea(area)}
          >
            {area.charAt(0).toUpperCase() + area.slice(1)}
          </PublicationButton>
        ))}
      </div>

      <section className="publication__list">
        {publications.map(
          (tpub, index) =>
            (selectedArea === "all" || selectedArea === tpub.category) && (
              <PublicationCard
                key={index}
                category={tpub.category}
                meta={tpub.research_meta}
                title={tpub.title}
              />
            ),
        )}
      </section>
    </div>
  );
}

export default Publication;
