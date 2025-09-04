import { useEffect, useMemo, useState } from "react";
import TimetableApi from "../../services/Api/Admin/TimeTableApi";
import { axiosClient } from "../../api/axios";

const unwrapChildren = (r) => r?.data?.data ?? r?.data?.children ?? r?.data ?? [];
const unwrapPayload  = (r) => r?.data?.data ?? r?.data ?? null;

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

export default function ParentTimetable() {
  const [children, setChildren] = useState([]);
  const [childId, setChildId]   = useState("");
  const [timetable, setTimetable] = useState(null);
  const [lessons, setLessons]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [loadingChild, setLoadingChild] = useState(false);

  // 1) Load linked children
  useEffect(() => {
    (async () => {
      try {
        // adjust if your endpoint differs (e.g. "/parent/students")
        const res = await axiosClient.get("/parent/children", { params: { per_page: 200 } });
        const kids = unwrapChildren(res);
        setChildren(kids);
        if (kids.length && !childId) setChildId(String(kids[0].id));
      } finally {
        setLoading(false);
      }
    })();
  }, []); // eslint-disable-line

  // 2) Load timetable for selected child
  useEffect(() => {
    if (!childId) return;
    (async () => {
      setLoadingChild(true);
      try {
        const res = await TimetableApi.parent({ child_id: childId });
        const payload = unwrapPayload(res);
        if (Array.isArray(payload)) {
          setLessons(payload);
          setTimetable(payload[0]?.timetable ?? null);
        } else {
          setLessons(payload?.lessons ?? []);
          setTimetable(payload?.timetable ?? null);
        }
      } finally {
        setLoadingChild(false);
      }
    })();
  }, [childId]);

  if (loading) return <div className="p-4 text-center">Loading…</div>;
  if (!children.length) return <div className="p-4 text-center">No linked students found.</div>;

  return (
    <div className="p-4 space-y-4">
      {/* Child selector (simple HTML select to avoid deps/paths) */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Select child:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={childId}
          onChange={(e) => setChildId(e.target.value)}
        >
          {children.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {(c.firstname && c.lastname) ? `${c.firstname} ${c.lastname}` : (c.name ?? `#${c.id}`)}
            </option>
          ))}
        </select>
        {loadingChild && <span className="text-xs text-muted-foreground">Loading timetable…</span>}
      </div>

      <div>
        <div className="text-xl font-semibold mb-3">
          {timetable?.title ?? "Child Timetable"}
        </div>
        <WeekGrid lessons={lessons} />
      </div>
    </div>
  );
}

function WeekGrid({ lessons }) {
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
                  {l.teacher ? `By ${l.teacher.firstname} ${l.teacher.lastname}` : ""}
                  {(l.room?.name ?? l.room) ? ` • ${l.room?.name ?? l.room}` : ""}
                </div>
              </div>
            ))}
            {!rowsByDay.get(val)?.length && <div className="text-xs text-muted-foreground">—</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
