// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";

// Pages
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import NotFound from "../pages/NotFound.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";

// Layouts
import Layout from "../layouts/Layout.jsx";
import GuestLayout from "../layouts/GeustLayout.jsx";
import StudentDashboardLayout from "../layouts/StudentDashboardLayout.jsx";
import AdminDashboardLayout   from "../layouts/AdminDashboardLayout.jsx";
import TeacherDashboardLayout from "../layouts/TeacherDashboardLayout.jsx";
import ParentDashboardLayout  from "../layouts/ParentDashboardLayout.jsx";
// Dashboards / pages (parent)
import ParentDashboard from '../components/Parent/ParentDashboard.jsx' ;
// Dashboards / Pages (Student)
import StudentDashboard  from "../components/student/StudentDashboard.jsx";
import StudentTimetable  from "../components/student/StudentTimetable.jsx";

// Dashboards / Pages (Teacher)
import TeacherDashboard  from "../components/Teacher/TeacherDashboard.jsx";
import TeacherTimetable  from "../components/teacher/TeacherTimeTable.jsx";

// Dashboards / Pages (Admin)
import AdminDashboard    from "../components/Admin/Pages/AdminDashboard.jsx";
import ManageParents     from "../components/Admin/Pages/ManageParents.jsx";
import ManageStudents    from "../components/Admin/Pages/ManageStudents.jsx";
import ManageTeachers    from "../components/Admin/Pages/ManageTeachers.jsx";
import ManageTimetables  from "../components/Admin/Pages/ManageTimetables.jsx"; // NEW

// ---------------- Route Constants ----------------
export const LOGIN_ROUTE                     = "/login";

// Student
export const STUDENT_DASHBOARD_ROUTE         = "/student/dashboard";
export const STUDENT_DASHBOARD_PARAM_ROUTE   = "/student/dashboard/:degree";
export const STUDENT_SCHEDULE_ROUTE          = "/student/schedule";

// Teacher
export const TEACHER_DASHBOARD_ROUTE         = "/teacher/dashboard";
export const TEACHER_SCHEDULE_ROUTE          = "/teacher/schedule";

// Parent
export const PARENT_DASHBOARD_ROUTE          = "/parent/dashboard";

// Admin
export const ADMIN_DASHBOARD_ROUTE           = "/admin/dashboard";
export const ADMIN_MANAGE_PARENTS_ROUTE      = "/admin/manage-parents";
export const ADMIN_MANAGE_STUDENTS_ROUTE     = "/admin/manage-students";
export const ADMIN_MANAGE_TEACHERS_ROUTE     = "/admin/manage-teachers";
export const ADMIN_MANAGE_TIMETABLES_ROUTE   = "/admin/manage-timetables"; // NEW

// Redirection Helper
export const redirectToDashboard = (roleType) => {
  switch (roleType) {
    case "student": return STUDENT_DASHBOARD_ROUTE; // StudentDashboard enforces degree slug
    case "admin":   return ADMIN_DASHBOARD_ROUTE;
    case "teacher": return TEACHER_DASHBOARD_ROUTE;
    case "parent":  return PARENT_DASHBOARD_ROUTE;
    default:        return LOGIN_ROUTE;
  }
};

// ---------------- Router Definition ----------------
export const router = createBrowserRouter([
  // Public shell
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "*", element: <NotFound /> },
    ],
  },

  // Guest (Login + Unauthorized)
  {
    element: <GuestLayout />,
    children: [
      { path: LOGIN_ROUTE,     element: <Login /> },
      { path: "/unauthorized", element: <Unauthorized /> },
    ],
  },

  // Student (Protected)
  {
    path: "/student",
    element: <StudentDashboardLayout />,
    children: [
      { path: "dashboard",         element: <StudentDashboard /> },
      { path: "dashboard/:degree", element: <StudentDashboard /> }, // enforced inside component
      { path: "schedule",          element: <StudentTimetable /> },
      // future: /student/courses, /student/assignments, etc.
    ],
  },

  // Admin (Protected)
  {
    path: "/admin",
    element: <AdminDashboardLayout />,
    children: [
      { path: "dashboard",        element: <AdminDashboard /> },
      { path: "manage-parents",   element: <ManageParents /> },
      { path: "manage-students",  element: <ManageStudents /> },
      { path: "manage-teachers",  element: <ManageTeachers /> },
      { path: "manage-timetables",element: <ManageTimetables /> }, // NEW
      // future: /admin/degrees, /admin/subjects, /admin/courses, /admin/exams, etc.
    ],
  },

  // Teacher (Protected)
  {
    path: "/teacher",
    element: <TeacherDashboardLayout />,
    children: [
      { path: "dashboard", element: <TeacherDashboard /> },
      { path: "schedule",  element: <TeacherTimetable /> },
      // future: /teacher/courses, /teacher/assignments, etc.
    ],
  },

  // Parent (Protected)
  {
    path: "/parent",
    element: <ParentDashboardLayout />,
    children: [
      { path: "dashboard", element: <ParentDashboard /> },
      // future: /parent/messages, /parent/documents, etc.
    ],
  },
]);

export default router;
