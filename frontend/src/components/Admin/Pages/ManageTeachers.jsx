import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.jsx";
import { Separator } from "../../ui/separator.jsx";
import TeacherUpsertForm from "../Forms/TeacherUpsertForm.jsx";
import AdminTeacherList from "../data-table/AdminTeacherList.jsx";
import UserApi from "../../../services/Api/UserApi.js";

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [tab, setTab] = useState("teacher_list");

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const resp = await UserApi.teachers();
      const list = Array.isArray(resp.data)
        ? resp.data
        : Array.isArray(resp.data.data)
        ? resp.data.data
        : [];
      setTeachers(list);
    } catch (e) {
      console.error("Error loading teachers:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleSaveTeacher = async (values) => {
    // always send role: 'teacher'
    if (editingTeacher) {
      
      await UserApi.update(values.id, { ...values, role: "teacher" });
    } else {
      await UserApi.create({ ...values, role: "teacher" });
    }
    await loadTeachers();
    setEditingTeacher(null);
    setTab("teacher_list");
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setTab("add_teacher");
  };

  const handleCancelEdit = () => {
    setEditingTeacher(null);
    setTab("teacher_list");
  };

  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-6">
      <TabsList>
        <TabsTrigger value="teacher_list">All Teachers</TabsTrigger>
        <TabsTrigger value="add_teacher">
          {editingTeacher ? "Edit Teacher" : "Add Teacher"}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="teacher_list">
        {loading ? (
          <p>Loading teachers…</p>
        ) : (
          <AdminTeacherList data={teachers} onEdit={handleEditTeacher} />
        )}
      </TabsContent>
      <Separator />
      <TabsContent value="add_teacher">
        <div className="max-w-md">
          <TeacherUpsertForm
            handleSubmit={handleSaveTeacher}
            values={editingTeacher}
            onCancel={handleCancelEdit}
          />
          {editingTeacher && (
            <button
              className="mt-2 text-blue-500 underline"
              onClick={handleCancelEdit}
              type="button"
            >
              Cancel edit
            </button>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
