import React from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "../../components/ui/dropdown-menu.js"
import { Button } from "../../components/ui/button.jsx"
import { User, LogOut } from "lucide-react"
import { useUserContext } from "../../context/StudentContext.jsx"
import { useNavigate } from "react-router-dom"
import { LOGIN_ROUTE } from "../../router/index.jsx"

export default function DefaultDropDownMenu({ children }) {
  const navigate = useNavigate()
  const { user, logout } = useUserContext()

  const handleLogout = async () => {
    try {
      await logout()              // calls your API and clears localStorage
      navigate(LOGIN_ROUTE, { replace: true })
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          {user?.firstname ?? "Account"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4} className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {children && (
          <>
            <DropdownMenuGroup>{children}</DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
