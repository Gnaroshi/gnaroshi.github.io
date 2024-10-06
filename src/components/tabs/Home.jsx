import "./Home.css";
import HomeResearch from "./Home/HomeResearch";
import HomeIntroduction from "./Home/HomeIntroduction";

function Home() {
  return (
    <div id="home-wrapper">
      <section id="home-introduce">
        <HomeIntroduction />
      </section>
      <section id="home-research">
        <HomeResearch />
      </section>
    </div>
  );
}

export default Home;
