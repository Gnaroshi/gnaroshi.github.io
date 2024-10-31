import "./PublicationCard.css";
import CORE_IMG from "../../../assets/images/research_concepts/core.png";

function PublicationCard({ category, meta, title, content = null }) {
  // console.log("pPPPPPPPPPPPPPPPPPPPPP");
  // console.log(category);
  // console.log(meta.author);
  // console.log(meta.published_place);
  // console.log(meta.published_date);
  // console.log(meta.source_code_link);
  // console.log(meta.paper_link);
  // console.log(title);
  // console.log(content);

  return (
    <div className="publication-card">
      <div className="publication-card-img">
        <img src={CORE_IMG} alt="" />
      </div>

      <div className={"publication-card-dividor " + category + "_ai"}></div>

      <div className="publication-card-info-wrapper">
        <div className="publication-card-title">
          <a href={meta.paper_link}>
            <p>{title}</p>
          </a>
        </div>
        {/* <div className={"publication-card-dividor " + category + "_ai"}></div> */}
        <div className="publication-card-publish">
          <p className="publication-card-published_place">
            {meta.published_date}
          </p>
          <p>{meta.published_place}</p>
        </div>
        <div className="publication-card-author">
          <p>{meta.author}</p>
        </div>
        {/* <div className={"publication-card-category " + category + "_ai"}> */}
        {/*   <p>{category}</p> */}
        {/* </div> */}
      </div>
    </div>
  );

  // let category = "application_ai";
  // return (
  //   <div id="publication-card">
  //     {/* <img src={CORE_IMG} alt="" /> */}
  //     {/* <h2>Title</h2> */}
  //     {/* <p> */}
  //     {/*   Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, */}
  //     {/*   eligendi? Officia facilis consequatur, aspernatur aperiam repellendus */}
  //     {/*   sequi? Neque quasi illum at facere hic iste quas voluptates, esse */}
  //     {/*   blanditiis laudantium maiores. */}
  //     {/* </p> */}
  //     {/* <button>more</button> */}
  //     {/* <div className={"title " + category}> */}
  //     <div className="publication-card-title">
  //       <p>Spatial Bias for Attention-free Non-local Neural Networks</p>
  //     </div>
  //     <div className={"publication-card-dividor " + category}></div>
  //     <div className="publication-card-publish">
  //       <p>
  //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores,
  //         eligendi? Officia facilis consequatur, aspernatur aperiam repellendus
  //         sequi? Neque quasi illum at facere hic iste quas voluptates, esse
  //         blanditiis laudantium maiores.
  //       </p>
  //     </div>
  //     <div className="publication-card-author">
  //       <p>Author</p>
  //     </div>
  //     {/* <div className="category"> */}
  //     <div className={"publication-card-category " + category}>
  //       <p>Application AI</p>
  //     </div>
  //   </div>
  // );
}

export default PublicationCard;
