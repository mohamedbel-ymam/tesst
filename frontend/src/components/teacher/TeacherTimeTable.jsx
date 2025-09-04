import { useEffect, useState, useMemo } from "react";
// ⬇️ adjust the path if your api file lives elsewhere
import TimetableApi from "../../services/Api/Admin/TimeTableApi";

// tiny helpers
const unwrapLessons = (r) =>
  r?.data?.data?.lessons ?? r?.data?.data ?? r?.data ?? [];

const getStart = (l) => l.start_time ?? l.starts_at ?? null;
const getEnd   = (l) => l.end_time   ?? l.ends_at   ?? null;

const DAYS = [
  { label: "Mon", val: 1 },
  { label: "Tue", val: 2 },
  { label: "Wed", val: 3 },
  { label: "Thu", val: 4 },
  { label: "Fri", val: 5 },
  { label: "Sat", val: 6 },
  { label: "Sun", val: 7 },
];

export default function TeacherTimetable() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // optional: pass { degree_id } if your teacher can choose a degree
        const res = await TimetableApi.teacher();
        setLessons(unwrapLessons(res));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading…</div>;

  return <WeekGrid title="My Lessons" lessons={lessons} showDegree />;
}

// Shared week grid
function WeekGrid({ title, lessons, showDegree=false }) {
  const rowsByDay = useMemo(() => {
    const m = new Map(DAYS.map(d => [d.val, []]));
    for (const l of lessons ?? []) {
      const day = Number(l.day_of_week);
      if (!m.has(day)) m.set(day, []);
      m.get(day).push(l);
    }
    for (const [k, arr] of m) {
      arr.sort((a, b) => {
        const sa = getStart(a), sb = getStart(b);
        if (sa && sb) return String(sa).localeCompare(String(sb));
        return (a.period ?? 0) - (b.period ?? 0);
      });
    }
    return m;
  }, [lessons]);

  return (
    <div className="p-4">
      <div className="text-lg font-semibold mb-3">{title || "Timetable"}</div>
      <div className="grid grid-cols-7 gap-2 text-sm">
        {DAYS.map(({label, val}) => (
          <div key={val}>
            <div className="font-medium mb-1">{label}</div>
            <div className="space-y-1">
              {rowsByDay.get(val)?.map(l => (
                <div key={l.id ?? `${val}-${l.subject_id}-${getStart(l)}`} className="rounded border p-2">
                  <div>
                    {l.subject?.name ?? "—"}{" "}
                    {getStart(l) && getEnd(l) ? `(${getStart(l)}–${getEnd(l)})` : (l.period ? `• Period ${l.period}` : "")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {showDegree && (l.timetable?.degree?.name || l.degree?.name)
                      ? `${l.timetable?.degree?.name ?? l.degree?.name} • `
                      : ""}
                    {l.room?.name ?? l.room ?? ""}
                  </div>
                </div>
              ))}
              {!rowsByDay.get(val)?.length && <div className="text-xs text-muted-foreground">—</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
