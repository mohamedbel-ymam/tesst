// src/components/Admin/Pages/ManageTimetables.jsx (skeleton)
import { useEffect, useState } from "react";
import TimetableApi from "../../../services/Api/Admin/TimetableApi";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { toast } from "sonner";

export default function ManageTimetables() {
  const [timetables, setTimetables] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [form, setForm] = useState({ degree_id:"", title:"" });

  useEffect(() => {
    TimetableApi.list({ per_page: 100 }).then(r => setTimetables(r.data.data.data || r.data.data));
    // load degrees (reuse axiosClient.get('/admin/degrees'))
  }, []);

  const create = async () => {
    try {
      const { data } = await TimetableApi.create(form);
      setTimetables(prev => [data.data, ...prev]);
      setForm({ degree_id:"", title:"" });
      toast.success("Timetable created");
    } catch (e) { toast.error("Failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Select onValueChange={v => setForm(f => ({...f, degree_id: v}))} value={form.degree_id}>
          <SelectTrigger><SelectValue placeholder="Degree" /></SelectTrigger>
          <SelectContent>
            {degrees.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Title" />
        <Button onClick={create}>Create</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {timetables.map(tt => (
          <TimetableCard key={tt.id} timetable={tt} />
        ))}
      </div>
    </div>
  );
}

function TimetableCard({ timetable }) {
  const [lessons, setLessons] = useState([]);
  useEffect(() => {
    TimetableApi.lessons(timetable.id).then(r => setLessons(r.data.data || []));
  }, [timetable.id]);

  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <div className="rounded-2xl p-4 shadow bg-white">
      <div className="font-semibold mb-2">{timetable.title} — {timetable.degree?.name}</div>
      <div className="grid grid-cols-7 gap-2 text-sm">
        {days.map((d, idx) => (
          <div key={idx}>
            <div className="font-medium mb-1">{d}</div>
            <div className="space-y-1">
              {lessons.filter(l => l.day_of_week === idx+1).map(l => (
                <div key={l.id} className="rounded border p-2">
                  <div>{l.subject?.name} ({l.start_time}–{l.end_time})</div>
                  <div className="text-xs text-gray-500">By {l.teacher?.firstname} {l.teacher?.lastname} {l.room ? `• ${l.room}` : ""}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* add-lesson form could sit here; call TimetableApi.addLesson(...) then refresh */}
    </div>
  );
}
