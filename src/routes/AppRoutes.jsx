import { Navigate, Route, Routes } from "react-router-dom";
import { PAGE_MANIFEST } from "./pageManifest";

function AppRoutes() {
  return (
    <Routes>
      {PAGE_MANIFEST.map((route) => {
        const RouteComponent = route.component;
        return (
          <Route
            key={`${route.tabKey}-${route.path}`}
            path={route.path}
            element={<RouteComponent />}
          />
        );
      })}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
