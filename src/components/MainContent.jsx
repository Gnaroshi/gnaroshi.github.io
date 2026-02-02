import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MainContent.css";

import {
  Contact,
  Home,
  Join,
  People,
  Photo,
  Publication,
  Research,
  TestPage,
} from "./tabs";

function MainContent({ selectedTab }) {
  const [selectedResearchTopic, setSelectedResearchTopic] = useState("core");
  const navigate = useNavigate();

  const handleActiveResearch = (topic) => {
    navigate("/research");
    setSelectedResearchTopic(topic);
  };

  return (
    <div className="main-content">
      {selectedTab && (
        <section className="main-content__body">
          {selectedTab === "home" && (
            <Home handleActiveResearch={handleActiveResearch} />
          )}
          {selectedTab === "test" && <TestPage />}
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
