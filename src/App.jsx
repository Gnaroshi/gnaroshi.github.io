import { useState } from "react";
import MainContent from "./components/MainContent.jsx";
import Nav from "./components/Nav.jsx";
import Lablvm from "./components/tabs/Lablvm.jsx";
import Footer from "./components/Footer.jsx";

import "./App.css";

function App() {
  // const [isNavAtTop, setIsNavAtTop] = useState(false);
  // const [selectedTab, setSelectedTab] = useState("home");
  const [selectedTab, setSelectedTab] = useState("home");

  const handleNavBtnClick = (tab) => {
    // setIsNavAtTop(true);
    setSelectedTab(tab);
  };

  return (
    <div id="app-wrapper">
      <div id="content-wrapper">
        <Nav id="top-nav" handleNavBtnClick={handleNavBtnClick} />
        <Lablvm isHome={selectedTab == "home"} />
        {/* <MainContent isNavAtTop={isNavAtTop} selectedTab={selectedTab} /> */}
        <MainContent selectedTab={selectedTab} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
