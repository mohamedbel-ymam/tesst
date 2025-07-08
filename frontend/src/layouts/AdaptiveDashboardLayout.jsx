import {useUserContext} from "../context/StudentContext.jsx";
import StudentDashboardLayout from "./StudentDashboardLayout.jsx";
import AdminDashboardLayout from "./AdminDashboardLayout.jsx";
import ParentDashboardLayout from "./ParentDashboardLayout.jsx";
import TeacherDashboardLayout from "./TeacherDashboardLayout.jsx";

export default function AdaptiveDashboardLayout({children}) {
  const {user} = useUserContext();

  if (user.role === 'admin') return <AdminDashboardLayout>{children}</AdminDashboardLayout>
  if (user.role === 'teacher') return <TeacherDashboardLayout>{children}</TeacherDashboardLayout>
  if (user.role === 'parent') return <ParentDashboardLayout>{children}</ParentDashboardLayout>
  return <StudentDashboardLayout>{children}</StudentDashboardLayout>
}