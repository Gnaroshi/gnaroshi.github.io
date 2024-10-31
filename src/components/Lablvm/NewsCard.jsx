import "./NewsCard.css";

function NewsCard({ newsCardContent }) {
  console.log(newsCardContent);
  return (
    <li className="news-card" style={newsCardContent.styles}>
      {/* <div className="carousel__slide-item-img-link"> */}
      {/*   <img src={newsCardContent.player.image} alt={props.player.title} /> */}
      {/* </div> */}
      <div className="news-card-content">
        <h1>{newsCardContent.news.title}</h1>
        <p>{newsCardContent.news.desc}</p>
      </div>
    </li>
  );
}

export default NewsCard;

// {/* <div className="news-card"> */}
// {/*   <div className="news-card-date-wrapper"> */}
// {/*     <p className="news-card-date">2024/09/28</p> */}
// {/*   </div> */}
// {/*   <div className="news-card-content"> */}
// {/*     <h1>WOW</h1> */}
// {/*     <p>fdsafdsafdsaasdf</p> */}
// {/*   </div> */}
// {/* </div>; */}
