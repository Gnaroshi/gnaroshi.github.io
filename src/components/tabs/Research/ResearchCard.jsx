import "./ResearchCard.css";
import CORE_IMG from "../../../assets/images/research_concepts/core.png";

function ResearchCard() {
  let category = "application_ai";
  return (
    <div id="research-card">
      {/* <img src={CORE_IMG} alt="" /> */}
      {/* <h2>Title</h2> */}
      {/* <p> */}
      {/*   Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, */}
      {/*   eligendi? Officia facilis consequatur, aspernatur aperiam repellendus */}
      {/*   sequi? Neque quasi illum at facere hic iste quas voluptates, esse */}
      {/*   blanditiis laudantium maiores. */}
      {/* </p> */}
      {/* <button>more</button> */}
      {/* <div className={"title " + category}> */}
      <div className="title">
        <p>Spatial Bias for Attention-free Non-local Neural Networks</p>
      </div>
      <div className={"card-dividor " + category}></div>
      <div className="publish">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores,
          eligendi? Officia facilis consequatur, aspernatur aperiam repellendus
          sequi? Neque quasi illum at facere hic iste quas voluptates, esse
          blanditiis laudantium maiores.
        </p>
      </div>
      <div className="author">
        <p>Author</p>
      </div>
      {/* <div className="category"> */}
      <div className={"category " + category}>
        <p>Application AI</p>
      </div>
    </div>
  );
}

export default ResearchCard;
