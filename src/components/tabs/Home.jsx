import "./Home.css";
import HomeResearch from "./HomeResearch";
import {
  HomeCTA,
  HomeHighlights,
  HomeLatestNewsList,
  HomePeoplePreview,
  HomeSelectedPublications,
} from "./home/index";

function Home({ handleActiveResearch }) {
  return (
    <div data-reveal data-reveal-load-delay="60" className="home">
      <HomeLatestNewsList />

      <HomeHighlights />

      <section data-reveal data-reveal-load-delay="120" className="home-block home__research">
        <HomeResearch handleActiveResearch={handleActiveResearch} />
      </section>

      <HomeSelectedPublications />

      <HomePeoplePreview />

      <HomeCTA />
    </div>
  );
}

export default Home;
