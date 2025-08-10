import { useEffect, useState } from "react";
import { TimetableViewApi } from "../../services/Api/TimetableViewApi";

export default function TeacherTimetable() {
  const [lessons, setLessons] = useState([]);
  useEffect(() => {
    TimetableViewApi.teacher().then(r => setLessons(r.data.data.lessons || []));
  }, []);
  return <WeekGrid title="My Lessons" lessons={lessons} showDegree />;
}

// Shared week grid
function WeekGrid({ title, lessons, showDegree=false }) {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <div className="p-4">
      <div className="text-lg font-semibold mb-3">{title || "Timetable"}</div>
      <div className="grid grid-cols-7 gap-2 text-sm">
        {days.map((d, idx) => (
          <div key={idx}>
            <div className="font-medium mb-1">{d}</div>
            <div className="space-y-1">
              {(lessons||[]).filter(l => l.day_of_week === idx+1).map(l => (
                <div key={l.id} className="rounded border p-2">
                  <div>{l.subject?.name} ({l.start_time}–{l.end_time})</div>
                  <div className="text-xs text-gray-500">
                    {showDegree ? `${l.timetable?.degree?.name ?? ""} • ` : ""}
                    {l.room ? `Room ${l.room}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}