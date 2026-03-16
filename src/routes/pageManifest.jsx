import { lazy } from "react";
import { ROUTE_DEFINITIONS, SSG_ROUTE_PATHS } from "./routeDefinitions";

const HomePage = lazy(() => import("../pages/HomePage"));
const NewsPage = lazy(() => import("../pages/NewsPage"));
const ResearchPage = lazy(() => import("../pages/ResearchPage"));
const PublicationPage = lazy(() => import("../pages/PublicationPage"));
const PeoplePage = lazy(() => import("../pages/PeoplePage"));
const PhotoPage = lazy(() => import("../pages/PhotoPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const JoinPage = lazy(() => import("../pages/JoinPage"));
const TestPageRoute = lazy(() => import("../pages/TestPageRoute"));

const PAGE_COMPONENTS = {
  home: HomePage,
  news: NewsPage,
  research: ResearchPage,
  publication: PublicationPage,
  people: PeoplePage,
  photo: PhotoPage,
  contact: ContactPage,
  join: JoinPage,
  test: TestPageRoute,
};

export const PAGE_MANIFEST = ROUTE_DEFINITIONS.map((route) => ({
  ...route,
  component: PAGE_COMPONENTS[route.tabKey],
}));

export { SSG_ROUTE_PATHS };
