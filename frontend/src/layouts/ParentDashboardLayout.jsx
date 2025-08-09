import { Link, Outlet, Navigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { LOGIN_ROUTE, STUDENT_DASHBOARD_ROUTE } from "../router/index.jsx";
import { useAuth } from '../context/AuthContext.jsx';
import { GaugeIcon } from "lucide-react";
import { ModeToggle } from "../components/mode-toggle.jsx";
import ParentDropDownMenu from "./drop-down-menu/ParentDropDownMenu.jsx";
import { ParentAdministrationSideBar } from "./Administration/ParentAdministrationSideBar.jsx";

export default function ParentDashboardLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div>Chargement…</div>;
  if (!user || user.role !== "parent") {
    return <Navigate to={LOGIN_ROUTE} replace />;
  }

  return (
    <>
      <header>
        <div className="items-center justify-between flex bg-opacity-90 px-12 py-4 mb-4 mx-auto">
          <div className="text-2xl text-white font-semibold inline-flex items-center">
            <Logo />
          </div>
          <div>
            <ul className="flex text-white place-items-center">
              <li className="ml-5 px-2 py-1">
                <Link className={'flex'} to={STUDENT_DASHBOARD_ROUTE}>
                  <GaugeIcon className={'mx-1'} />Dashboard
                </Link>
              </li>
              <li className="ml-5 px-2 py-1">
                <ParentDropDownMenu />
              </li>
              <li className="ml-5 px-2 py-1">
                <ModeToggle />
              </li>
            </ul>
          </div>
        </div>
      </header>
      <hr />
      <main className={'mx-auto px-10 space-y-4 py-4'}>
        <div className="flex">
          <div className={'w-full md:w-2/12 border mr-2 rounded-l'}>
            <ParentAdministrationSideBar />
          </div>
          <div className={'w-full md:w-10/12 border rounded-l'}>
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}
