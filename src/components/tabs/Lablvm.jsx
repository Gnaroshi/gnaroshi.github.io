import "./Lablvm.css";
import News from "../Lablvm/News";

function Lablvm({ isHome }) {
  return (
    <div id="lablvm">
      <h1>
        LAB
        <wbr />
        LVM
      </h1>

      {/* <div className="lablvm-ajou"> */}
      {/*   <p>Ajou University</p> */}
      {/* </div> */}

      {isHome && (
        <section id="news-abs" className="custom-scrollbar">
          <News />
        </section>
      )}
    </div>
  );
}

export default Lablvm;
