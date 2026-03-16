import { ROUTE_DEFINITIONS, SSG_ROUTE_PATHS } from "./routeDefinitions";
import HomePage from "../pages/HomePage";
import NewsPage from "../pages/NewsPage";
import ResearchPage from "../pages/ResearchPage";
import PublicationPage from "../pages/PublicationPage";
import PeoplePage from "../pages/PeoplePage";
import PhotoPage from "../pages/PhotoPage";
import ContactPage from "../pages/ContactPage";
import JoinPage from "../pages/JoinPage";
import TestPageRoute from "../pages/TestPageRoute";

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

export const PAGE_MANIFEST_SSG = ROUTE_DEFINITIONS.map((route) => ({
  ...route,
  component: PAGE_COMPONENTS[route.tabKey],
}));

export { SSG_ROUTE_PATHS };
