import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext.jsx';
import { SELECT_DEGREE_ROUTE } from "../../router/index.jsx";

const degrees = [
  { id: 1, label: "First Year", value: "first" },
  { id: 2, label: "Second Year", value: "second" },
  { id: 3, label: "Third Year", value: "third" },
  { id: 4, label: "Fourth Year", value: "fourth" },
  { id: 5, label: "Final Year", value: "final" },
];



export default function DegreeSelector() {
  const navigate = useNavigate();
  const { setSelectedDegree } = useAuth();

  const handleSelect = (degree) => {
    setSelectedDegree(degree.value); // update context + localStorage
    navigate(`/student/dashboard/${degree.value}`, { replace: true });
  };

  const resetAndReload = () => {
    setSelectedDegree(null);
    localStorage.removeItem("SELECTED_DEGREE");
    navigate(SELECT_DEGREE_ROUTE, { replace: true });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={resetAndReload}
          className="text-sm underline text-red-600"
        >
          Reset Degree Selection
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {degrees.map((degree) => (
          <button
            key={degree.id}
            onClick={() => handleSelect(degree)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            {degree.label}
          </button>
        ))}
      </div>
    </>
  );
}
