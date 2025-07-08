import { cn } from "@/lib/utils";
import { Button } from "../../components/ui/button.jsx";
import { ScrollArea } from "../../components/ui/scroll-area.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/StudentContext.jsx";
import UserApi from "../../services/Api/UserApi.js";

export function StudentAdministrationSideBar({ className }) {
  const navigate = useNavigate();
  const { logout: contextLogout } = useUserContext();

  const handleLogout = async () => {
    try {
      await UserApi.logout();
      contextLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { label: "🏠 Dashboard", path: "/student/dashboard" },
    { label: "📚 Courses", path: "/student/courses" },
    { label: "📝 Assignments", path: "/student/assignments" },
    { label: "📆 Timetable", path: "/student/schedule" },
    { label: "📊 Grades & Reports", path: "/student/grades" },
    { label: "📩 Messages & Notifications", path: "/student/messages" },
    { label: "📑 Exams", path: "/student/exams" },
    { label: "💬 Forums", path: "/student/forums" },
    { label: "📁 Documents", path: "/student/documents" },
    { label: "⚙️ Settings", path: "/student/settings" },
  ];

  return (
    <div className={cn("pb-12", className)}>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Student Menu
        </h2>
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left"
              asChild
            >
              <Link to={item.path}>{item.label}</Link>
            </Button>
          ))}
          {/* Logout button (handled manually) */}
          <Button
            variant="ghost"
            className="w-full justify-start text-left text-red-600 hover:bg-red-500 hover:text-white dark:bg-red-600 dark:text-white"
            onClick={handleLogout}
          >
            🚪 Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
