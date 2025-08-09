// src/layouts/StudentDashboardLayout.jsx
import { Link, Outlet, Navigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext.jsx';
import {
  LOGIN_ROUTE,
  STUDENT_DASHBOARD_ROUTE,
} from "../router/index.jsx"

import Logo from "../components/Logo.jsx"
import StudentDropDownMenu from "../layouts/drop-down-menu/StudentDropDownMenu.jsx"
import { StudentAdministrationSideBar } from "./Administration/StudentAdministrationSidebar.jsx"
import { ModeToggle } from "../components/mode-toggle.jsx"
import { GaugeIcon } from "lucide-react"

export default function StudentDashboardLayout() {
  const { user, loading, logout } = useAuth()

  // 1. Tant que la vérif auth n'est pas finie, ne rend rien ou affiche un loader
  if (loading) return <div>Chargement…</div>

  // 2. Si pas loggé ou mauvais rôle, redirige proprement (évite les useEffect/navigate)
  if (!user || user.role !== "student") {
    return <Navigate to={LOGIN_ROUTE} replace />
  }

  // 3. Sinon, on affiche tout le layout normalement
  return (
    <>
      <header className="flex items-center justify-between bg-opacity-90 px-12 py-4 mb-4">
        <div className="text-2xl text-white font-semibold">
          <Logo />
        </div>
        <ul className="flex items-center text-white">
          <li className="ml-5 px-2 py-1">
            <Link
              to={STUDENT_DASHBOARD_ROUTE.replace(":degree", "default")} // ← adapt here if you want a default degree or use a dynamic param
              className="flex items-center"
            >
              <GaugeIcon className="mr-1" /> Dashboard
            </Link>
          </li>
          <li className="ml-5 px-2 py-1">
            <StudentDropDownMenu />
          </li>
          <li className="ml-5 px-2 py-1">
            <ModeToggle />
          </li>
        </ul>
      </header>

      <hr />

      <main className="px-10 py-4">
        <div className="flex gap-4">
          <aside className="w-full md:w-1/4">
            <StudentAdministrationSideBar />
          </aside>
          <section className="w-full md:w-3/4">
            <Outlet />
          </section>
        </div>
      </main>
    </>
  )
}
