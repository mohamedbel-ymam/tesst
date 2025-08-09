import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "../../components/ui/dropdown-menu.jsx";
import {Button} from "../../components/ui/button.js";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react'
import {LOGIN_ROUTE} from "../../router/index.jsx";
import { useAuth } from '../../context/AuthContext.jsx';
import {useNavigate} from "react-router-dom";
import DefaultDropDownMenu from "./DefaultDropDownMenu.jsx";

export default function AdminDropDownMenu() {
  return <>
    <DefaultDropDownMenu>
    </DefaultDropDownMenu>
  </>
}