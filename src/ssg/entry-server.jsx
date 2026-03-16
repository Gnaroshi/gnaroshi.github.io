import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import AppSSG from "../App.ssg";
import { getRouterBasename, joinBasenameWithPath } from "../routes/routerBasename";

export function render(url = "/") {
  const basename = getRouterBasename();
  const initialPath = joinBasenameWithPath(basename, url);

  return renderToString(
    <MemoryRouter basename={basename} initialEntries={[initialPath]}>
      <AppSSG />
    </MemoryRouter>,
  );
}
