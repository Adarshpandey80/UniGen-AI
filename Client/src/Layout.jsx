import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Plus } from "lucide-react";

function Layout() {
  const [history, setHistory] = useState([
    "What is MERN stack?",
    "Generate AI image",
    "Create marketing video",
  ]);

  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
