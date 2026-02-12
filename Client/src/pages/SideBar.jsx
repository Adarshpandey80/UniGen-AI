import React, { useState } from "react";
import {
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
} from "lucide-react";

function SideBar() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

  const history = [
    "What is MERN stack?",
    "Generate AI image",
    "Create marketing video",
  ];

  return (
    <div
      className={`h-full bg-slate-950 border-r border-slate-800 flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {isOpen && (
          <h2 className="text-lg font-semibold tracking-wide">
            UniGen AI
          </h2>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition"
        >
          {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 transition p-2 rounded-xl text-sm">
          <Plus size={16} />
          {isOpen && "New Chat"}
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2">
        {history.map((item, index) => (
          <div
            key={index}
            onClick={() => setActiveChat(index)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer text-sm transition ${
              activeChat === index
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <MessageSquare size={16} />

            {isOpen && (
              <span className="truncate">{item}</span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        {isOpen ? "© 2026 UniGen AI" : "AI"}
      </div>
    </div>
  );
}

export default SideBar;
