import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import { Lablvm } from "./components/tabs";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import BackToTopButton from "./components/BackToTopButton";
import "./App.css";

function App() {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("home");

  useEffect(() => {
    const path = location.pathname === "/" ? "home" : location.pathname.slice(1);
    setSelectedTab(path);
  }, [location.pathname]);

  return (
    <div className="app">
      <ScrollProgress />
      <div className="app__content site-shell">
        <Nav />
        <Lablvm isHome={selectedTab === "home"} />
        <MainContent selectedTab={selectedTab} />
      </div>
      <BackToTopButton />
      <Footer />
    </div>
  );
}

export default App;
