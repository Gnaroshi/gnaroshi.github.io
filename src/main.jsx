import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { getRouterBasename } from "./routes/routerBasename";

const appTree = (
  <StrictMode>
    <BrowserRouter basename={getRouterBasename()}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

if (container.hasChildNodes()) {
  hydrateRoot(container, appTree);
} else {
  createRoot(container).render(appTree);
}
