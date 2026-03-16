import { useLocation } from "react-router-dom";
import Research from "../components/tabs/Research";

function ResearchPage() {
  const location = useLocation();
  const selectedResearchTopic = location.state?.selectedResearchTopic ?? null;

  return <Research selectedResearchTopic={selectedResearchTopic} />;
}

export default ResearchPage;
