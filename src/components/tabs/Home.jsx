import "./Home.css";
import News from "./Home/News";
import ResearchAbs from "./Home/ResearchAbs";

function Home() {
  return (
    <div id="home">
      <section id="lablvm">
        <h1>LAB</h1>
        <h1>LVM</h1>
        <section id="news-abs">
          <News />
        </section>
      </section>

      <section id="research-abs">
        <ResearchAbs />
      </section>
    </div>
  );
}

export default Home;
