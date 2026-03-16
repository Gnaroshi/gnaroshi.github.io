import { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import BackToTopButton from "./components/BackToTopButton";
import AppRoutes from "./routes/AppRoutes";
import { resolveTabFromPath } from "./routes/routeUtils";
import "./App.css";

const Lablvm = lazy(() => import("./components/tabs/Lablvm"));

function App() {
  const location = useLocation();
  const selectedTab = resolveTabFromPath(location.pathname);

  return (
    <div className="app">
      <ScrollProgress />
      <div className="app__content site-shell">
        <Nav />
        {selectedTab === "home" ? (
          <Suspense fallback={<div className="app__hero-loading" aria-hidden="true" />}>
            <Lablvm isHome />
          </Suspense>
        ) : null}
        <MainContent selectedTab={selectedTab}>
          <AppRoutes />
        </MainContent>
      </div>
      <BackToTopButton />
      <Footer />
    </div>
  );
}

export default App;
