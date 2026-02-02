import "./News.css";
import NEWSCONTENT from "../../assets/dataset/news.json";
import { useEffect, useState } from "react";

const NEWSMAXLEN = 5;
const NEWS_SLIDE_WIDTH = 30;
const NEWS_ITEMS = NEWSCONTENT.slice(0, NEWSMAXLEN);
const NEWS_ITEMS_LOOPED = [...NEWS_ITEMS, ...NEWS_ITEMS];

const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const createNewsCard = (position, i) => {
  const newsCard = {
    styles: {
      transform: `translateX(${position * NEWS_SLIDE_WIDTH}rem)`,
    },
    news: NEWS_ITEMS_LOOPED[i].news,
  };

  switch (position) {
    case NEWSMAXLEN - 1:
    case NEWSMAXLEN + 1:
      newsCard.styles = {
        ...newsCard.styles,
        filter: "grayscale(1)",
        opacity: "0.2",
      };
      break;
    case NEWSMAXLEN:
      break;
    default:
      newsCard.styles = { ...newsCard.styles, opacity: 0 };
      break;
  }

  return newsCard;
};

const NewsCarouselSlideItem = ({ pos, idx }) => {
  const item = createNewsCard(pos, idx);

  return (
    <li className="news-carousel__slide" style={item.styles}>
      <div className="news-carousel__slide-body">
        <div className="news-carousel__date-wrap">
          <p className="news-carousel__date">{item.news.date}</p>
        </div>
        <h1 className="news-carousel__title">{item.news.title}</h1>
        <p className="news-carousel__desc">{item.news.desc}</p>
      </div>
    </li>
  );
};

const keys = Array.from(Array(NEWS_ITEMS_LOOPED.length).keys());

function News() {
  const [items, setItems] = useState(keys);
  const [isTicking, setIsTicking] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const coverLength = NEWS_ITEMS_LOOPED.length;

  const prevClick = (jump = 1) => {
    if (!isTicking) {
      setIsTicking(true);
      setItems((prev) => {
        return prev.map((_, i) => prev[(i + jump) % coverLength]);
      });
    }
  };

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
  }, [isTicking]);

  useEffect(() => {
    setActiveIdx((NEWSMAXLEN - (items[0] % NEWSMAXLEN)) % NEWSMAXLEN);
  }, [items]);

  return (
    <div className="news-carousel">
      <div className="news-carousel__inner">
        <button className="news-carousel__nav news-carousel__nav--prev" onClick={() => prevClick()}>
          <i className="news-carousel__arrow news-carousel__arrow--left" />
        </button>
        <div className="news-carousel__viewport">
          <ul className="news-carousel__track">
            {items.map((pos, i) => (
              <NewsCarouselSlideItem
                key={i}
                idx={i}
                pos={pos}
              />
            ))}
          </ul>
        </div>
        <button className="news-carousel__nav news-carousel__nav--next" onClick={() => nextClick()}>
          <i className="news-carousel__arrow news-carousel__arrow--right" />
        </button>
        <div className="news-carousel__dots">
          {items.slice(0, NEWSMAXLEN).map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`news-carousel__dot ${i === activeIdx ? "is-active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default News;
