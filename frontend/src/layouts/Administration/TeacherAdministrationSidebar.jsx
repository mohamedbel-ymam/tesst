import { cn } from "@/lib/utils";
import { Button } from "../../components/ui/button.jsx";
import { ScrollArea } from "../../components/ui/scroll-area.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export function TeacherAdministrationSideBar({ className }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menu = [
    { label: "🏠 Dashboard",    path: "/teacher/dashboard" },
    { label: "📆 Timetable",    path: "/teacher/schedule" },
    { label: "📚 My Courses",   path: "/teacher/courses" },
    { label: "📝 Assignments",  path: "/teacher/assignments" },
    { label: "🧪 Exams",        path: "/teacher/exams" },
    { label: "📊 Grades",       path: "/teacher/grades" },
    { label: "📩 Messages",     path: "/teacher/messages" },
    { label: "📁 Documents",    path: "/teacher/documents" },
    { label: "⚙️ Settings",     path: "/teacher/settings" },
  ];

  return (
    <div className={cn("pb-12", className)}>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Teacher Menu
        </h2>

        <ScrollArea className="h-[calc(100vh-140px)] pr-2">
          <div className="space-y-1">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "block w-full rounded-md px-3 py-2 text-left text-sm",
                    "hover:bg-muted transition-colors",
                    isActive ? "bg-muted font-semibold" : "text-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            <Button
              variant="ghost"
              className="w-full justify-start text-left text-red-600 hover:bg-red-500 hover:text-white"
              onClick={handleLogout}
            >
              🚪 Logout
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
