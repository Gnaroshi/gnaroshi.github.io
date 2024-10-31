import "./Publication.css";
import PublicationCard from "./Publication/PublicationCard";
import AA from "../../assets/dataset/application_ai.json";
import BA from "../../assets/dataset/biomedical_ai.json";
import CA from "../../assets/dataset/core_ai.json";
import MMA from "../../assets/dataset/multi-modal_ai.json";
import { useState } from "react";
import PublicationBtn from "./Publication/PublicationBtn";

const AA_PUB = AA.published;
const BA_PUB = BA.published;
const CA_PUB = CA.published;
const MMA_PUB = MMA.published;
// const PUB = { ...AA_PUB, ...BA_PUB, ...CA_PUB, ...MMA_PUB };
// console.log(PUB);
// let allPub = {};
let allPub = { ...AA_PUB, ...BA_PUB, ...CA_PUB, ...MMA_PUB };

let areaCategory = ["all"];
let areaCategorySelected = {};
if (Object.keys(AA_PUB).length != 0) {
  areaCategory.push("application");
}
if (Object.keys(BA_PUB).length != 0) {
  areaCategory.push("biomedical");
}
if (Object.keys(CA_PUB).length != 0) {
  areaCategory.push("core");
}
if (Object.keys(MMA_PUB).length != 0) {
  areaCategory.push("multi-modal");
}

areaCategory.forEach((item) => {
  areaCategorySelected[item] = 1;
});

Object.keys(allPub).forEach((key) => {
  if (key.startsWith("aa")) {
    allPub[key].category = "application";
  } else if (key.startsWith("ba")) {
    allPub[key].category = "biomedical";
  } else if (key.startsWith("ca")) {
    allPub[key].category = "core";
  } else if (key.startsWith("mma")) {
    allPub[key].category = "multi-modal";
  }
});

console.log(allPub);

// // 출판 시각 기준 정렬
// let pub = [];
//
// Object.values(allPub).forEach((section) => {
//   Object.values(section).forEach((tpub) => {
//     pub.push(tpub);
//   });
// });
let pub = Object.values(allPub).sort((a, b) => {
  const dateA = new Date(a.research_meta.published_date);
  const dateB = new Date(b.research_meta.published_date);
  return dateB - dateA;
});

// console.log(pub);

function Publication() {
  let [selectedArea, setSelectedArea] = useState("all");
  function handleSelectedArea(selectedArea) {
    setSelectedArea(selectedArea);
    if (selectedArea === "all") {
      for (let k in areaCategorySelected) {
        areaCategorySelected[k] = 1;
      }
    } else {
      for (let k in areaCategorySelected) {
        if (k === selectedArea) areaCategorySelected[k] = 1;
        else areaCategorySelected[k] = 0;
      }
    }

    // console.log(selectedArea);
  }

  // console.log(areaCategorySelected);
  // console.log(areaCategorySelected[pub[0].category]);

  // console.log("AFDSFDASFDSAFDSA");
  // pub.map((tpub, index) => {
  //   // console.log(tpub.category);
  //   console.log(tpub);
  // });

  return (
    <div className="publication">
      <h1>Publication</h1>
      <div className="publication-area-btn-wrapper">
        {areaCategory.map((area, i) => (
          <PublicationBtn
            key={area + i}
            isSelected={selectedArea === area}
            onSelect={() => handleSelectedArea(area)}
          >
            {area.charAt(0).toUpperCase() + area.slice(1)}
          </PublicationBtn>
        ))}
      </div>

      <section className="publication-card-wrapper">
        {pub.map(
          (tpub, index) =>
            areaCategorySelected[tpub.category] === 1 && (
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
