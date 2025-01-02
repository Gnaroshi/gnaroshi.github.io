import { useState } from "react";
import NavBtn from "./NavBtn.jsx";
import "./Nav.css";

export default function Nav({ handleNavBtnClick }) {
  const [selectedTab, setSelectedTab] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  function handleSelectTab(selectedTabButton) {
    handleNavBtnClick(selectedTabButton);
    setSelectedTab(selectedTabButton);
    setIsMenuOpen(false);
  }

  const tabs = [
    "home",
    // "about",
    "research",
    "publication",
    "people",
    "photo",
    "contact",
  ];

  return (
    <>
      <div
        className={`navbar-overlay ${isMenuOpen ? "visible" : ""}`}
        onClick={toggleMenu}
      ></div>
      <div className="navbar">
        <div className="navbar-header">
          <div className="navbar-lablvm">LAB LVM</div>
          <button className="navbar-toggle" onClick={toggleMenu}>
            ☰
          </button>
        </div>
        <div className={`navbar-links ${isMenuOpen ? "collapsed" : ""}`}>
          <button className="navbar-toggle-close" onClick={toggleMenu}>
            ✕
          </button>
          {tabs.map((tab, i) => (
            <NavBtn
              key={tab + i}
              isSelected={selectedTab === tab}
              onSelect={() => handleSelectTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </NavBtn>
          ))}
        </div>
      </div>
    </>
  );
}
