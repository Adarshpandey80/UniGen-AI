import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";
import SideBar from "./pages/SideBar";

function Layout() {
  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      
      {/* Sidebar */}
      <SideBar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <Sparkles className="text-blue-500" />
            <h1 className="text-xl font-semibold tracking-wide">
              UniGen AI
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition hover:text-blue-400 ${
                  isActive ? "text-blue-500" : "text-slate-400"
                }`
              }
            >
              Text Generator
            </NavLink>

            <NavLink
              to="/image"
              className={({ isActive }) =>
                `transition hover:text-blue-400 ${
                  isActive ? "text-blue-500" : "text-slate-400"
                }`
              }
            >
              Image Generator
            </NavLink>

            <NavLink
              to="/video"
              className={({ isActive }) =>
                `transition hover:text-blue-400 ${
                  isActive ? "text-blue-500" : "text-slate-400"
                }`
              }
            >
              Video Generator
            </NavLink>
          </nav>

          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-semibold text-sm">
              AP
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
