import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NavButton from "./Nav.Button";
import { resolveTabFromPath } from "../routes/routeUtils";
import "./Nav.css";
import LABLVMLOGO from "../assets/logo.svg";

const MOBILE_NAV_QUERY = "(max-width: 57rem)";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNav, setIsMobileNav] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia(MOBILE_NAV_QUERY).matches;
  });
  const location = useLocation();
  const selectedTab = resolveTabFromPath(location.pathname);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQueryList = window.matchMedia(MOBILE_NAV_QUERY);
    const syncMobileState = (eventOrList) => {
      const matches = "matches" in eventOrList ? eventOrList.matches : mediaQueryList.matches;
      setIsMobileNav(matches);
      if (!matches) {
        setIsMenuOpen(false);
      }
    };

    syncMobileState(mediaQueryList);
    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", syncMobileState);
    } else {
      mediaQueryList.addListener(syncMobileState);
    }

    return () => {
      if (typeof mediaQueryList.removeEventListener === "function") {
        mediaQueryList.removeEventListener("change", syncMobileState);
      } else {
        mediaQueryList.removeListener(syncMobileState);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMobileNav || !isMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen, isMobileNav]);

  const toggleMenu = () => {
    if (!isMobileNav) {
      return;
    }
    setIsMenuOpen((prev) => !prev);
  };

  const handleSelectTab = () => {
    setIsMenuOpen(false);
  };

  const tabs = [
    "home",
    "news",
    "test",
    "research",
    "publication",
    "people",
    "photo",
    "contact",
  ];

  return (
    <>
      {isMobileNav ? (
        <div
          className={`nav__overlay ${isMenuOpen ? "is-visible" : ""}`}
          onClick={toggleMenu}
        ></div>
      ) : null}
      <div className={`nav animated-surface ${isMenuOpen ? "is-menu-open" : ""}`}>
        <div className="nav__header">
          <Link
            to="/"
            className="nav__logo"
            onClick={handleSelectTab}
            aria-label="Go to Home"
          >
            <img src={LABLVMLOGO} alt="LABLVM logo" />
          </Link>
          {isMobileNav ? (
            <button
              type="button"
              className="nav__toggle btn btn--icon btn--sm interactive-button"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="nav-links"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <span className="nav__toggle-icon" aria-hidden="true">
                {isMenuOpen ? "✕" : "☰"}
              </span>
            </button>
          ) : null}
        </div>
        <div
          id="nav-links"
          className={`nav__links animated-surface ${isMobileNav && !isMenuOpen ? "is-hidden" : ""}`}
        >
          {tabs.map((tab, i) => (
            <NavButton
              key={tab + i}
              tabKey={tab}
              isSelected={selectedTab === tab}
              onSelect={handleSelectTab}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </NavButton>
          ))}
        </div>
      </div>
    </>
  );
}
