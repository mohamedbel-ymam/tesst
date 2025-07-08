import './App.css'
import {RouterProvider} from "react-router-dom";
import {router} from "./router/index.jsx";
import { StudentProvider } from "./context/StudentContext.jsx";
import {ThemeProvider} from "./components/themeProvider.jsx";
import {Toaster} from "./components/ui/sonner.jsx";

function App() {
  return (
    <>
      <StudentProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router}/>
        </ThemeProvider>
      </StudentProvider>
      <Toaster/>
    </>
  )
}

export default App
