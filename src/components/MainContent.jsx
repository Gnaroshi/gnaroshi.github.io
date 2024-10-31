import { useState } from "react";

import "./MainContent.css";

import Home from "./tabs/Home.jsx";
import About from "./tabs/About.jsx";
import Research from "./tabs/Research.jsx";
import Publication from "./tabs/Publication.jsx";
import People from "./tabs/People.jsx";
import Photo from "./tabs/Photo.jsx";
import Join from "./tabs/Join.jsx";
import Contact from "./tabs/Contact.jsx";

function MainContent({ selectedTab }) {
  return (
    <div id="main-content-wrapper">
      {selectedTab && (
        <section id="content">
          {selectedTab === "home" && <Home />}
          {selectedTab === "about" && <About />}
          {selectedTab === "publication" && <Publication />}
          {selectedTab === "research" && <Research />}
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
