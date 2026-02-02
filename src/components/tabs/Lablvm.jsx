import "./Lablvm.css";
import News from "../Lablvm/News";

function Lablvm({ isHome }) {
  return (
    <div className="hero">
      <h1>
        Lab
        <wbr />
        LVM
      </h1>

      {isHome && (
        <section className="hero__news custom-scrollbar">
          <News />
        </section>
      )}
    </div>
  );
}

export default Lablvm;
