// src/components/student/StudentDashboard.jsx
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { degreeToSlug } from "../../utils/degreeSlug.js";

import FirstDegreeDashboard from "./degrees/FirstDegreeDashboard.jsx";
import SecondDegreeDashboard from "./degrees/SecondDegreeDashboard.jsx";
import ThirdDegreeDashboard from "./degrees/ThirdDegreeDashboard.jsx";
import ForthDegreeDashboard from "./degrees/ForthDegreeDashboard.jsx";
import FinalDegreeDashboard from "./degrees/FinalDegreeDashboard.jsx";

export default function StudentDashboard() {
  const { degree: routeSlug } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-4 text-center">Loading…</div>;
  }

  if (!user || user.role !== "student") {
    return <div className="p-4 text-center text-red-600">Unauthorized.</div>;
  }

  // Compute allowed slug from user's assigned degree (may be null)
  const allowedSlug = useMemo(() => degreeToSlug(user.degree), [user.degree]);

  // If no degree assigned, don't try to redirect/render dashboards
  if (!allowedSlug) {
    return (
      <div className="p-6 text-center">
        <p className="font-semibold">No degree assigned to your account yet.</p>
        <p className="text-sm text-gray-500">Please contact the administration.</p>
      </div>
    );
  }

  // Enforce allowed slug
  useEffect(() => {
    if (!routeSlug || routeSlug !== allowedSlug) {
      navigate(`/student/dashboard/${allowedSlug}`, { replace: true });
    }
  }, [routeSlug, allowedSlug, navigate]);

  if (routeSlug !== allowedSlug) {
    return null; // waiting for redirect
  }

  switch (allowedSlug) {
    case "first":  return <FirstDegreeDashboard />;
    case "second": return <SecondDegreeDashboard />;
    case "third":  return <ThirdDegreeDashboard />;
    case "fourth": return <ForthDegreeDashboard />;
    case "final":  return <FinalDegreeDashboard />;
    default:
      return <div className="text-center p-4">Unknown degree.</div>;
  }
}
