// src/components/Admin/Pages/ManageTimeTables.jsx
import { useEffect, useMemo, useState } from "react";
import TimetableApi from "../../../services/Api/Admin/TimeTableApi";
import { axiosClient } from "../../../api/axios";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { toast } from "sonner";

// --- helpers ---------------------------------------------------------------

// unwrap Laravel paginator / resource / plain array
const unwrap = (r) => r?.data?.data ?? r?.data ?? [];

// normalize time field names across APIs
const getStart = (row) => row?.start_time ?? row?.starts_at ?? null;
const getEnd   = (row) => row?.end_time   ?? row?.ends_at   ?? null;

// weekdays
const DAYS = [
  { label: "Mon", val: 1 },
  { label: "Tue", val: 2 },
  { label: "Wed", val: 3 },
  { label: "Thu", val: 4 },
  { label: "Fri", val: 5 },
  { label: "Sat", val: 6 },
  { label: "Sun", val: 7 },
];

// prefer adminList() if present, else fall back to list()
const fetchAdminTimetables = (params) => {
  const fn = TimetableApi.adminList ?? TimetableApi.list;
  return fn(params);
};

// --------------------------------------------------------------------------

export default function ManageTimetables() {
  const [showCreate, setShowCreate] = useState(false);
  const [degreeId, setDegreeId]     = useState("__all__");
  const [teacherId, setTeacherId]   = useState("__all__");
  const [degrees, setDegrees]       = useState([]);
  const [teachers, setTeachers]     = useState([]);
  const [subjects, setSubjects]     = useState([]);
  const [rooms, setRooms]           = useState([]); // optional; ok if endpoint missing
  const [rows, setRows]             = useState([]);
  const [loading, setLoading]       = useState(false);

  // load degrees + teachers + subjects (+ rooms if available)
  useEffect(() => {
    (async () => {
      try {
        const [degRes, tchRes, subRes] = await Promise.all([
          axiosClient.get("/admin/degrees",  { params: { per_page: 200 } }),
          axiosClient.get("/admin/users",    { params: { role: "teacher", per_page: 200 } }),
          axiosClient.get("/admin/subjects", { params: { per_page: 200 } }),
        ]);
        setDegrees(unwrap(degRes));
        setTeachers(unwrap(tchRes));
        setSubjects(unwrap(subRes));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load filter lists");
      }

      // Try rooms; ignore if 404/not implemented
      try {
        const roomRes = await axiosClient.get("/admin/rooms", { params: { per_page: 200 } });
        setRooms(unwrap(roomRes));
      } catch {
        setRooms([]); // silently ignore
      }
    })();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const params = {
        per_page: 1000,
        ...(degreeId !== "__all__" ? { degree_id: degreeId } : {}),
        ...(teacherId !== "__all__" ? { teacher_id: teacherId } : {}),
      };
      const res = await fetchAdminTimetables(params);
      setRows(unwrap(res));
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || "Failed to load timetables";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* initial */ }, []); // eslint-disable-line

  // group by degree, then render by day_of_week
  const grouped = useMemo(() => {
    const byDegree = new Map();
    for (const r of rows) {
      const dId = r.degree_id ?? r.degree?.id ?? "unknown";
      if (!byDegree.has(dId)) byDegree.set(dId, { degree: r.degree ?? null, items: [] });
      byDegree.get(dId).items.push(r);
    }
    return Array.from(byDegree.values());
  }, [rows]);

  const resetFilters = async () => {
    setDegreeId("__all__");
    setTeacherId("__all__");
    setLoading(true);
    try {
      const res = await fetchAdminTimetables({ per_page: 1000 }); // no filters
      setRows(unwrap(res));
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to load timetables");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* filters */}
      <div className="flex flex-wrap gap-2 items-end">
        <div className="w-48">
          <Select value={degreeId} onValueChange={setDegreeId}>
            <SelectTrigger><SelectValue placeholder="Filter by degree" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All degrees</SelectItem>
              {degrees.map(d => (
                <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-56">
          <Select value={teacherId} onValueChange={setTeacherId}>
            <SelectTrigger><SelectValue placeholder="Filter by teacher" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All teachers</SelectItem>
              {teachers.map(t => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.firstname} {t.lastname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setShowCreate(true)} variant="secondary">+ New row</Button>
        <Button onClick={load} disabled={loading}>{loading ? "Loading…" : "Apply"}</Button>
        <Button variant="ghost" onClick={resetFilters} disabled={loading}>Reset</Button>
      </div>

      {/* create panel */}
      {showCreate && (
        <CreateRowPanel
          degrees={degrees}
          teachers={teachers}
          subjects={subjects}
          rooms={rooms}
          onCancel={() => setShowCreate(false)}
          onCreated={async () => {
            // Refresh from server for canonical order & eager-loaded relations
            await load();
            toast.success("Row created");
            setShowCreate(false);
          }}
        />
      )}

      {/* grids */}
      <div className="space-y-6">
        {grouped.map(({ degree, items }, idx) => (
          <DegreeTimetable key={degree?.id ?? idx} degree={degree} items={items} />
        ))}
        {!grouped.length && (
          <div className="text-sm text-muted-foreground">No timetable rows found.</div>
        )}
      </div>
    </div>
  );
}

function DegreeTimetable({ degree, items }) {
  // Build day -> rows map (sorted by start time or period)
  const rowsByDay = useMemo(() => {
    const m = new Map(DAYS.map(d => [d.val, []]));
    for (const it of items) {
      const day = Number(it.day_of_week);
      if (!m.has(day)) m.set(day, []);
      m.get(day).push(it);
    }
    for (const [k, arr] of m) {
      arr.sort((a, b) => {
        const sa = getStart(a);
        const sb = getStart(b);
        if (sa && sb) return String(sa).localeCompare(String(sb));
        return (a.period ?? 0) - (b.period ?? 0);
      });
      m.set(k, arr);
    }
    return m;
  }, [items]);

  return (
    <div className="rounded-2xl p-4 shadow bg-white">
      <div className="font-semibold mb-3">
        {degree?.name ? `Degree: ${degree.name}` : "Degree"}
      </div>

      <div className="grid grid-cols-7 gap-3 text-sm">
        {DAYS.map(({ label, val }) => (
          <div key={val}>
            <div className="font-medium mb-2">{label}</div>
            <div className="space-y-2">
              {rowsByDay.get(val)?.map((l) => (
                <div
                  key={l.id ?? `${val}-${l.degree_id ?? degree?.id ?? "x"}-${l.subject_id ?? "s"}-${getStart(l) ?? l.period ?? "p"}`}
                  className="rounded border p-2"
                >
                  <div className="font-medium">
                    {l.subject?.name ?? "—"}{" "}
                    {getStart(l) && getEnd(l)
                      ? `(${getStart(l)}–${getEnd(l)})`
                      : l.period
                      ? `• Period ${l.period}`
                      : ""}
                  </div>
                  <div className="text-xs text-gray-500">
                    {l.teacher ? <>By {l.teacher.firstname} {l.teacher.lastname}</> : null}
                    {l.degree?.name ? <> • {l.degree.name}</> : null}
                    {l.room?.name ? <> • {l.room.name}</> : null}
                  </div>
                </div>
              ))}
              {!rowsByDay.get(val)?.length && (
                <div className="text-xs text-muted-foreground">—</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Inline create panel (no dialog dependency) */
function CreateRowPanel({ degrees, teachers, subjects, rooms, onCancel, onCreated }) {
  const [form, setForm] = useState({
    degree_id: "",
    subject_id: "",
    teacher_id: "",
    day_of_week: "1",
    starts_at: "",
    ends_at: "",
    period: "",
    room_id: "",
  });
  const [saving, setSaving] = useState(false);

  const canSave =
    form.degree_id &&
    form.subject_id &&
    form.teacher_id &&
    form.day_of_week &&
    ((form.starts_at && form.ends_at) || form.period);

  const save = async () => {
    if (!canSave) return;

    setSaving(true);
    try {
      const payload = {
        degree_id: Number(form.degree_id),
        subject_id: Number(form.subject_id),
        teacher_id: Number(form.teacher_id),
        day_of_week: Number(form.day_of_week),
        ...(form.starts_at ? { starts_at: form.starts_at } : {}),
        ...(form.ends_at ? { ends_at: form.ends_at } : {}),
        ...(form.period ? { period: Number(form.period) } : {}),
        ...(form.room_id ? { room_id: Number(form.room_id) } : {}),
      };

      const res = await TimetableApi.create(payload);
      const created = res?.data?.data ?? res?.data;
      onCreated?.(created);
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        Object.values(e?.response?.data?.errors ?? {})?.[0]?.[0] ||
        "Failed to create row";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border p-4 bg-white space-y-3 dark:bg-gray-800 dark:text-white ">
      <div className="font-semibold">Create timetable row</div>
      <div className="grid md:grid-cols-6 gap-3">
        {/* Degree */}
        <div className="col-span-2">
          <Select value={form.degree_id} onValueChange={(v) => setForm(f => ({...f, degree_id: v}))}>
            <SelectTrigger><SelectValue placeholder="Degree *" /></SelectTrigger>
            <SelectContent>
              {degrees.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Subject */}
        <div className="col-span-2">
          <Select value={form.subject_id} onValueChange={(v) => setForm(f => ({...f, subject_id: v}))}>
            <SelectTrigger><SelectValue placeholder="Subject *" /></SelectTrigger>
            <SelectContent>
              {subjects.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Teacher */}
        <div className="col-span-2">
          <Select value={form.teacher_id} onValueChange={(v) => setForm(f => ({...f, teacher_id: v}))}>
            <SelectTrigger><SelectValue placeholder="Teacher *" /></SelectTrigger>
            <SelectContent>
              {teachers.map(t => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.firstname} {t.lastname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Day of week */}
        <div>
          <Select value={form.day_of_week} onValueChange={(v) => setForm(f => ({...f, day_of_week: v}))}>
            <SelectTrigger><SelectValue placeholder="Day *" /></SelectTrigger>
            <SelectContent>
              {DAYS.map(d => <SelectItem key={d.val} value={String(d.val)}>{d.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Time range (optional if using period) */}
        <div>
          <Input type="time" value={form.starts_at} onChange={e => setForm(f => ({...f, starts_at: e.target.value}))} placeholder="Start" />
        </div>
        <div>
          <Input type="time" value={form.ends_at} onChange={e => setForm(f => ({...f, ends_at: e.target.value}))} placeholder="End" />
        </div>

        {/* Or period number */}
        <div>
          <Input type="number" min="1" value={form.period} onChange={e => setForm(f => ({...f, period: e.target.value}))} placeholder="Period #" />
        </div>

        {/* Room (optional) */}
        {rooms.length > 0 && (
          <div>
            <Select value={form.room_id} onValueChange={(v) => setForm(f => ({...f, room_id: v}))}>
              <SelectTrigger><SelectValue placeholder="Room (optional)" /></SelectTrigger>
              <SelectContent>
                {rooms.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={save} disabled={!canSave || saving}>{saving ? "Saving…" : "Save row"}</Button>
        <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
      </div>

      <div className="text-xs text-muted-foreground">
        Required: Degree, Subject, Teacher, Day, and either a Time range (Start &amp; End) <em>or</em> a Period number.
      </div>
    </div>
  );
}
