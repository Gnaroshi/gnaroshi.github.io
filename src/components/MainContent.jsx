import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRevealOnScroll from "../hooks/useRevealOnScroll";

import "./MainContent.css";

import {
  Contact,
  Home,
  Join,
  News,
  People,
  Photo,
  Publication,
  Research,
  TestPage,
} from "./tabs";

function MainContent({ selectedTab }) {
  const [selectedResearchTopic, setSelectedResearchTopic] = useState(null);
  const contentBodyRef = useRef(null);
  const navigate = useNavigate();
  useRevealOnScroll(contentBodyRef, selectedTab);

  const handleActiveResearch = (topic) => {
    navigate("/research");
    setSelectedResearchTopic(topic);
  };

  return (
    <div className="main-content">
      {selectedTab && (
        <section
          key={selectedTab}
          ref={contentBodyRef}
          className={`main-content__body main-content__body--route main-content__body--${selectedTab}`}
        >
          {selectedTab === "home" && (
            <Home handleActiveResearch={handleActiveResearch} />
          )}
          {selectedTab === "test" && <TestPage />}
          {selectedTab === "news" && <News />}
          {selectedTab === "publication" && <Publication />}
          {selectedTab === "research" && (
            <Research selectedResearchTopic={selectedResearchTopic} />
          )}
          {selectedTab === "people" && <People />}
          {selectedTab === "photo" && <Photo />}
          {selectedTab === "join" && <Join />}
          {selectedTab === "contact" && <Contact />}
        </section>
      )}
    </div>
  );
}

export default MainContent;
