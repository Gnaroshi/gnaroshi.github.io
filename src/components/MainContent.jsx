import { Suspense, useRef } from "react";
import useRevealOnScroll from "../hooks/useRevealOnScroll";

import "./MainContent.css";

const tabLabel = (tabKey = "") => {
  if (!tabKey) {
    return "page";
  }
  return tabKey.charAt(0).toUpperCase() + tabKey.slice(1);
};

export function MainContentFallback({ selectedTab }) {
  return (
    <div className="main-content__loading" role="status" aria-live="polite">
      <p className="main-content__loading-kicker">Loading</p>
      <p className="main-content__loading-title">{tabLabel(selectedTab)}</p>
      <div className="main-content__loading-line" />
    </div>
  );
}

function MainContent({ selectedTab, children }) {
  const contentBodyRef = useRef(null);
  useRevealOnScroll(contentBodyRef, selectedTab);

  return (
    <div className="main-content">
      {selectedTab && (
        <section
          key={selectedTab}
          ref={contentBodyRef}
          className={`main-content__body main-content__body--route main-content__body--${selectedTab}`}
        >
          <Suspense fallback={<MainContentFallback selectedTab={selectedTab} />}>
            {children}
          </Suspense>
        </section>
      )}
    </div>
  );
}

export default MainContent;
