import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.jsx";
import { Separator } from "../../ui/separator.jsx";
import  TeacherUpsertForm  from "../Forms/TeacherUpsertForm.jsx";
import AdminTeacherList from "../data-table/AdminTeacherList.jsx";
import TeacherApi from "../../../services/Api/Admin/TeacherApi.js";

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const resp = await TeacherApi.all();
      const list = Array.isArray(resp.data)
        ? resp.data
        : Array.isArray(resp.data.data)
        ? resp.data.data
        : [];
      setTeachers(list);
    } catch (e) {
      console.error("Error loading teachers", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSaveTeacher = async (values) => {
    const res = await TeacherApi.create(values);
    await fetchTeachers();
    return res;
  };

  return (
    <Tabs defaultValue="teacher_list" className="space-y-6">
      <TabsList>
        <TabsTrigger value="teacher_list">All Teachers</TabsTrigger>
        <TabsTrigger value="add_teacher">Add Teacher</TabsTrigger>
      </TabsList>

      <TabsContent value="teacher_list">
        {loading ? (
          <p>Loading teachers…</p>
        ) : (
          <AdminTeacherList data={teachers} refreshList={fetchTeachers} />
        )}
      </TabsContent>

      <Separator />

      <TabsContent value="add_teacher">
        <div className="max-w-md">
          <TeacherUpsertForm handleSubmit={handleSaveTeacher} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
