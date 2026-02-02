import "./Home.css";
import HomeIntroduction from "./Home.Introduction";
import HomeResearch from "./HomeResearch";

function Home({ handleActiveResearch }) {
  return (
    <div className="home">
      <section className="home__introduction">
        <HomeIntroduction />
      </section>
      <section className="home__research">
        <HomeResearch handleActiveResearch={handleActiveResearch} />
      </section>
      <div className="home__placeholder">
        <p>추가 내용 구현 예정</p>
      </div>
    </div>
  );
}

export default Home;
