import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.jsx";
import { Separator } from "../../ui/separator.jsx";
import StudentUpsertForm from "../Forms/StudentUpsertForm.jsx";
import AdminStudentsList from "../data-table/AdminStudentsList.jsx";
import UserApi from "../../../services/Api/UserApi.js";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [tab, setTab] = useState("students_list");

  const loadStudents = async () => {
    setLoading(true);
    try {
      // Use UserApi.students() to fetch all students
      const resp = await UserApi.students();
      const list = Array.isArray(resp.data)
        ? resp.data
        : Array.isArray(resp.data.data)
        ? resp.data.data
        : [];
      setStudents(list);
    } catch (e) {
      console.error("Error loading students:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSaveStudent = async (values) => {
    if (editingStudent) {
      
      await UserApi.update(values.id, { ...values, role: "student" });
    } else {
      await UserApi.create({ ...values, role: "student" });
    }
    await loadStudents();
    setEditingStudent(null);
    setTab("students_list");
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setTab("add_student");
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setTab("students_list");
  };

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="students_list">All Students</TabsTrigger>
          <TabsTrigger value="add_student">
            {editingStudent ? "Edit Student" : "Add Student"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="students_list">
          {loading ? (
            <p>Loading students…</p>
          ) : (
            <AdminStudentsList data={students} onEdit={handleEditStudent} />
          )}
        </TabsContent>
        <Separator />
        <TabsContent value="add_student">
          <div className="max-w-md">
            <StudentUpsertForm
              handleSubmit={handleSaveStudent}
              values={editingStudent}
              onCancel={handleCancelEdit}
            />
            {editingStudent && (
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
    </div>
  );
}
