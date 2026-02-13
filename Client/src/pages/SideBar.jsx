import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Trash 
} from "lucide-react";


function SideBar({ onSelectChat }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [history, setHistory] = useState([]);


    const api = `${import.meta.env.VITE_API_URL}/user/history`;
  useEffect(() => {
    const fetchHistory = async () => {
    
      try {
        const res = await axios.get(api);
        setHistory(res.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);
    
  const deleteHistory = async(id)=>{
     const api = `${import.meta.env.VITE_API_URL}/user/deletehistory/${id}`;
     console.log("button clicked")
  }

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

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2">
        {history.map((item, index) => (
          <div
            key={item._id}
            onClick={() => {
              setActiveChat(index);
              onSelectChat(item); 
            }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer text-sm transition ${
              activeChat === index
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <MessageSquare size={16} />
            <button> <Trash size={18} onClick={()=>{deleteHistory(item._id)}}/></button>
           

            {isOpen && (
              <span className="truncate">
                {item.request[0]}
              </span>
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
