import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axios";

export default function StudentTimetable() {
  const [data, setData] = useState({ timetable: null, lessons: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get("/student/timetable")
      .then((r) => setData(r.data?.data || { timetable:null, lessons:[] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">Loading…</div>;
  if (!data.timetable) return <div className="p-4 text-center">No timetable yet.</div>;

  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  return (
    <div className="p-4">
      <div className="text-xl font-semibold mb-3">{data.timetable.title}</div>
      <div className="grid grid-cols-7 gap-2 text-sm">
        {days.map((d, idx) => (
          <div key={d}>
            <div className="font-medium mb-1">{d}</div>
            <div className="space-y-1">
              {data.lessons
                .filter(l => l.day_of_week === idx+1)
                .map(l => (
                  <div key={l.id} className="rounded border p-2">
                    <div>{l.subject?.name} ({l.start_time}–{l.end_time})</div>
                    <div className="text-xs text-gray-500">
                      {l.teacher ? `By ${l.teacher.firstname} ${l.teacher.lastname}` : ""}
                      {l.room ? ` • ${l.room}` : ""}
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
