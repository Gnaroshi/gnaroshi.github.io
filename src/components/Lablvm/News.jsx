import "./News.css";
// import NewsCard from "./NewsCard";
import NEWSCONTENT from "../../assets/dataset/news.json";
import { useEffect, useState } from "react";

// This component code refereed to Ryan Santos's "Simple React Carousel Slides"

const NEWS = NEWSCONTENT;
const newsSlideWidth = 30;
const newsSlideLength = NEWS.length;
NEWS.push(...NEWS);

const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const createNewsCard = (position, i) => {
  const newsCard = {
    styles: {
      transform: `translateX(${position * newsSlideWidth}rem)`,
    },
    news: NEWS[i].news,
  };

  switch (position) {
    case newsSlideLength - 1:
    case newsSlideLength + 1:
      newsCard.styles = {
        ...newsCard.styles,
        filter: "grayscale(1)",
        opacity: "0.2",
      };
      break;
    case newsSlideLength:
      break;
    default:
      newsCard.styles = { ...newsCard.styles, opacity: 0 };
      break;
  }

  return newsCard;
};

const NewsCarouselSlideItem = ({ pos, idx, activeIdx }) => {
  const item = createNewsCard(pos, idx, activeIdx);

  // return <NewsCard newsCardContent={item} />;
  return (
    <li className="news-slide-item" style={item.styles}>
      {/* <div className="news-slide-item-img-link"> */}
      {/*   <img src={item.news.image} alt={item.news.title} /> */}
      {/* </div> */}
      <div className="news-slide-item-body">
        <div className="news-slide-item-date-wrapper">
          <p className="news-slide-item-date">{item.news.date}</p>
        </div>
        <h1 className="news-slide-item-title">{item.news.title}</h1>
        <p className="news-slide-item-desc">{item.news.desc}</p>
      </div>
    </li>
  );
};

const keys = Array.from(Array(NEWS.length).keys());

function News() {
  const [items, setItems] = useState(keys);
  const [isTicking, setIsTicking] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const coverLength = NEWS.length;

  const prevClick = (jump = 1) => {
    if (!isTicking) {
      setIsTicking(true);
      setItems((prev) => {
        return prev.map((_, i) => prev[(i + jump) % coverLength]);
      });
    }
  };

  // console.log(`newsSlideLength : ${newsSlideLength}`);
  // console.log(`coverLength : ${coverLength}`);

  const nextClick = (jump = 1) => {
    if (!isTicking) {
      setIsTicking(true);
      setItems((prev) => {
        return prev.map((_, i) => prev[(i - jump + coverLength) % coverLength]);
      });
    }
  };

  const handleDotClick = (idx) => {
    if (idx < activeIdx) prevClick(activeIdx - idx);
    if (idx > activeIdx) nextClick(idx - activeIdx);
  };

  useEffect(() => {
    if (isTicking) {
      sleep(300).then(() => {
        setIsTicking(false);
      });
    }
  });

  useEffect(() => {
    setActiveIdx(
      (newsSlideLength - (items[0] % newsSlideLength)) % newsSlideLength,
    );
  }, [items]);

  return (
    <div className="news-card-wrapper">
      <div className="news-card-inner">
        <button className="news-btn news-btn-prev" onClick={() => prevClick()}>
          <i className="news-btn-arrow news-btn-arrow-left" />
        </button>
        <div className="news-container">
          <ul className="news-slide-list">
            {items.map((pos, i) => (
              <NewsCarouselSlideItem
                key={i}
                idx={i}
                pos={pos}
                activeIdx={activeIdx}
              />
            ))}
          </ul>
        </div>
        <button className="news-btn news-btn-next" onClick={() => nextClick()}>
          <i className="news-btn-arrow news-btn-arrow-right" />
        </button>
        <div className="news-dots">
          {items.slice(0, length).map((pos, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={
                i === activeIdx ? "news-dot news-dot-active" : "news-dot"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default News;
