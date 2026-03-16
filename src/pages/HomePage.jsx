import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../components/tabs/Home";

function HomePage() {
  const navigate = useNavigate();

  const handleActiveResearch = useCallback(
    (topic) => {
      navigate("/research", {
        state: { selectedResearchTopic: topic },
      });
    },
    [navigate],
  );

  return <Home handleActiveResearch={handleActiveResearch} />;
}

export default HomePage;
