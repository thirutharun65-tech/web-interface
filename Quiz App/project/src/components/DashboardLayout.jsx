import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { storage } from "../utils/storage";

// Shared dashboard layout: navbar on top, sidebar on the left, content on the right.
export default function DashboardLayout() {
  const [theme, setTheme] = useState(storage.getTheme());
  const user = storage.getCurrentUser();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    storage.setTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return (
    <div className="app-layout">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <div className="app-body">
        <Sidebar role={user?.role} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
