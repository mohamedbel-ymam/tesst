import { cn } from "@/lib/utils";
import { Button } from "../../components/ui/button.jsx";
import { ScrollArea } from "../../components/ui/scroll-area.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Existing route constants
import {
  ADMIN_MANAGE_PARENTS_ROUTE,
  ADMIN_MANAGE_STUDENTS_ROUTE,
  ADMIN_MANAGE_TEACHERS_ROUTE,
  ADMIN_DASHBOARD_ROUTE,
} from "../../router/index.jsx";

// Icons
import {
  LayoutDashboard,
  Users,
  User,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Files,
  MessagesSquare,
  ClipboardList,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";

// Fallback routes (create pages/routes for these if you haven't yet)
const ADMIN_MANAGE_ADMINS_ROUTE   = "/admin/manage-admins";
const ADMIN_DEGREES_ROUTE         = "/admin/degrees";
const ADMIN_SUBJECTS_ROUTE        = "/admin/subjects";
const ADMIN_COURSES_ROUTE         = "/admin/courses";
const ADMIN_TIMETABLES_ROUTE      = "/admin/manage-timetables";
const ADMIN_EXAMS_ROUTE           = "/admin/exams";
const ADMIN_MESSAGES_ROUTE        = "/admin/messages";
const ADMIN_DOCUMENTS_ROUTE       = "/admin/documents";
const ADMIN_SETTINGS_ROUTE        = "/admin/settings";
const ADMIN_ROLES_ROUTE           = "/admin/roles";

export function AdminAdministrationSideBar({ className }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const groups = [
    {
      title: "Dashboard",
      items: [
        { label: "Overview", to: ADMIN_DASHBOARD_ROUTE, icon: LayoutDashboard },
      ],
    },
    {
      title: "Users",
      items: [
        { label: "Admins",   to: ADMIN_MANAGE_ADMINS_ROUTE,   icon: User },
        { label: "Teachers", to: ADMIN_MANAGE_TEACHERS_ROUTE, icon: GraduationCap },
        { label: "Students", to: ADMIN_MANAGE_STUDENTS_ROUTE, icon: Users },
        { label: "Parents",  to: ADMIN_MANAGE_PARENTS_ROUTE,  icon: Users },
      ],
    },
    {
      title: "Academics",
      items: [
        { label: "Degrees",    to: ADMIN_DEGREES_ROUTE,    icon: GraduationCap },
        { label: "Subjects",   to: ADMIN_SUBJECTS_ROUTE,   icon: BookOpen },
        { label: "Courses",    to: ADMIN_COURSES_ROUTE,    icon: BookOpen },
        { label: "Timetables", to: ADMIN_TIMETABLES_ROUTE, icon: CalendarDays },
        { label: "Exams",      to: ADMIN_EXAMS_ROUTE,      icon: ClipboardList },
      ],
    },
    {
      title: "Communication",
      items: [
        { label: "Messages",  to: ADMIN_MESSAGES_ROUTE,  icon: MessagesSquare },
        { label: "Documents", to: ADMIN_DOCUMENTS_ROUTE, icon: Files },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Roles & Permissions", to: ADMIN_ROLES_ROUTE,    icon: ShieldCheck },
        { label: "Settings",            to: ADMIN_SETTINGS_ROUTE, icon: Settings },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <div className={cn("pb-12", className)}>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Administration
        </h2>

        <ScrollArea className="h-[calc(100vh-140px)] pr-2">
          <div className="space-y-5">
            {groups.map((group) => (
              <div key={group.title}>
                <div className="px-4 text-xs font-semibold uppercase text-muted-foreground mb-2">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map(({ label, to, icon: Icon }) => (
                    <Button key={to} variant="ghost" className="w-full justify-start" asChild>
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          cn(
                            "w-full flex items-center gap-2 rounded-md",
                            isActive && "bg-muted font-semibold"
                          )
                        }
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {label}
                      </NavLink>
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            <Button
              variant="ghost"
              className="w-full justify-start text-left text-red-600 hover:bg-red-500 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
