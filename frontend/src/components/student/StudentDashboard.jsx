import { useParams } from "react-router-dom";
import FirstDegreeDashboard from "./degrees/FirstDegreeDashboard.jsx";
import SecondDegreeDashboard from "./degrees/SecondDegreeDashboard.jsx";
import ThirdDegreeDashboard from "./degrees/ThirdDegreeDashboard.jsx";
import ForthDegreeDashboard from "./degrees/ForthDegreeDashboard.jsx";
import FinalDegreeDashboard from "./degrees/FinalDegreeDashboard.jsx";

export default function StudentDashboard() {
  const { degree } = useParams(); // 🔥 This is now dynamic

  switch (degree) {
    case "first":
      return <FirstDegreeDashboard />;
    case "second":
      return <SecondDegreeDashboard />;
    case "third":
      return <ThirdDegreeDashboard />;
    case "fourth":
      return <ForthDegreeDashboard />;
    case "final":
      return <FinalDegreeDashboard />;
    default:
      return <p className="text-center p-4">Please select a valid degree.</p>;
  }
}
