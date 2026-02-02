import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavButton from "./Nav.Button";
import "./Nav.css";
import LABLVMLOGO from "../assets/logo.svg";

export default function Nav() {
  const [selectedTab, setSelectedTab] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname === "/" ? "home" : location.pathname.slice(1);
    setSelectedTab(path);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleSelectTab = (selectedTabButton) => {
    setSelectedTab(selectedTabButton);
    setIsMenuOpen(false);
    const path = selectedTabButton === "home" ? "/" : `/${selectedTabButton}`;
    navigate(path);
  };

  const tabs = [
    "home",
    "test",
    "research",
    "publication",
    "people",
    "photo",
    "contact",
  ];

  return (
    <>
      <div
        className={`nav__overlay ${isMenuOpen ? "is-visible" : ""}`}
        onClick={toggleMenu}
      ></div>
      <div className="nav">
        <div className="nav__header">
          <div className="nav__logo" onClick={() => handleSelectTab("home")}>
            <img src={LABLVMLOGO} alt="LABLVM logo" />
          </div>
          <button className="nav__toggle" onClick={toggleMenu}>
            ☰
          </button>
        </div>
        <div className={`nav__links ${isMenuOpen ? "" : "is-hidden"}`}>
          <button className="nav__toggle nav__toggle--close" onClick={toggleMenu}>
            ✕
          </button>
          {tabs.map((tab, i) => (
            <NavButton
              key={tab + i}
              isSelected={selectedTab === tab}
              onSelect={() => handleSelectTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </NavButton>
          ))}
        </div>
      </div>
    </>
  );
}
