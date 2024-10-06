import "./HomeResearch.css";
import HomeResearchCard from "./HomeResearchCard";
import CONTENTS from "../../../assets/dataset/performance_management.json";

function HomeResearch() {
  const HOME_CONTENTS = Object.values(CONTENTS.contents);

  return (
    <div id="home-research-wrapper">
      <h1>Research Area</h1>

      {/* <p> */}
      {/*   Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, */}
      {/*   accusamus numquam! Perspiciatis, veniam, recusandae, rem cupiditate a */}
      {/*   enim maiores aliquam excepturi modi et doloribus harum ut? Ab at quaerat */}
      {/*   non. Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita */}
      {/*   esse voluptatem quae ipsam perferendis nam et velit rem id! Labore dolor */}
      {/*   a voluptatibus earum molestiae aut at ut eveniet veniam? */}
      {/* </p> */}
      <div id="home-research-card-wrapper">
        {HOME_CONTENTS.map((contentItem, i) => (
          <HomeResearchCard key={i} {...contentItem} />
        ))}
      </div>
      {/* <HomeResearchCard {...HOME_CONTENTS.core_ai} /> */}
    </div>
  );
}

export default HomeResearch;
