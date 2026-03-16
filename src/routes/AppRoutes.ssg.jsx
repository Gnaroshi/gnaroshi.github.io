import { Route, Routes } from "react-router-dom";
import { PAGE_MANIFEST_SSG } from "./pageManifest.ssg";
import HomePage from "../pages/HomePage";

function AppRoutesSSG() {
  return (
    <Routes>
      {PAGE_MANIFEST_SSG.map((route) => {
        const RouteComponent = route.component;
        return (
          <Route
            key={`${route.tabKey}-${route.path}`}
            path={route.path}
            element={<RouteComponent />}
          />
        );
      })}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default AppRoutesSSG;
