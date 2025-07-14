// src/router/index.jsx
import { createBrowserRouter } from "react-router-dom";

// Pages
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import NotFound from "../pages/NotFound.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";  // ← new

// Layouts
import Layout from "../layouts/Layout.jsx";
import GuestLayout from "../layouts/GeustLayout.jsx";
import StudentDashboardLayout from "../layouts/StudentDashboardLayout.jsx";
import AdminDashboardLayout   from "../layouts/AdminDashboardLayout.jsx";
import TeacherDashboardLayout from "../layouts/TeacherDashboardLayout.jsx";
import ParentDashboardLayout  from "../layouts/ParentDashboardLayout.jsx";

// Components & Dashboards
import DegreeSelector    from "../components/student/DegreeSelector.jsx";
import StudentDashboard  from "../components/student/StudentDashboard.jsx";
import AdminDashboard    from "../components/Admin/Pages/AdminDashboard.jsx";
import TeacherDashboard  from "../components/Teacher/TeacherDashboard.jsx";
import ParentDashboard   from "../components/Parent/ParentDashboard.jsx";

// Admin Pages
import ManageParents   from "../components/Admin/Pages/ManageParents.jsx";
import ManageStudents  from "../components/Admin/Pages/ManageStudents.jsx";
import ManageTeachers  from "../components/Admin/Pages/ManageTeachers.jsx";

// Route Constants
export const LOGIN_ROUTE                  = "/login";
export const SELECT_DEGREE_ROUTE          = "/student/select-degree";
export const STUDENT_DASHBOARD_ROUTE      = "/student/dashboard/:degree";
export const ADMIN_DASHBOARD_ROUTE        = "/admin/dashboard";
export const TEACHER_DASHBOARD_ROUTE      = "/teacher/dashboard";
export const PARENT_DASHBOARD_ROUTE       = "/parent/dashboard";
export const ADMIN_MANAGE_PARENTS_ROUTE   = "/admin/manage-parents";
export const ADMIN_MANAGE_STUDENTS_ROUTE  = "/admin/manage-students";
export const ADMIN_MANAGE_TEACHERS_ROUTE  = "/admin/manage-teachers";

// Redirection Helper
export const redirectToDashboard = (roleType) => {
  switch (roleType) {
    case "student": return SELECT_DEGREE_ROUTE;
    case "admin":   return ADMIN_DASHBOARD_ROUTE;
    case "teacher": return TEACHER_DASHBOARD_ROUTE;
    case "parent":  return PARENT_DASHBOARD_ROUTE;
    default:        return LOGIN_ROUTE;
  }
};

// Router Definition
export const router = createBrowserRouter([
  // Public Pages
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
      { path: LOGIN_ROUTE,        element: <Login /> },
      { path: "/unauthorized",    element: <Unauthorized /> },  // ← new
    ],
  },
  // Student Routes (Protected)
  {
    path: "/student",
    element: <StudentDashboardLayout />,
    children: [
      { path: "select-degree",            element: <DegreeSelector /> },
      { path: "dashboard/:degree",        element: <StudentDashboard /> },
    ],
  },
  // Admin Routes (Protected)
  {
    path: "/admin",
    element: <AdminDashboardLayout />,
    children: [
      { path: "dashboard",        element: <AdminDashboard /> },
      { path: "manage-parents",   element: <ManageParents /> },
      { path: "manage-students",  element: <ManageStudents /> },
      { path: "manage-teachers",  element: <ManageTeachers /> },
    ],
  },
  // Teacher Routes
  {
    path: "/teacher",
    element: <TeacherDashboardLayout />,
    children: [
      { path: "dashboard", element: <TeacherDashboard /> },
    ],
  },
  // Parent Routes
  {
    path: "/parent",
    element: <ParentDashboardLayout />,
    children: [
      { path: "dashboard", element: <ParentDashboard /> },
    ],
  },
]);

// ensure the default export matches your import in App/Main:
export default router;
