import React from 'react'

function SideBar() {
  return (
    <>
     {/* Sidebar */}
      <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-wide">UniGen AI</h2>

          <button className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 transition p-2 rounded-xl text-sm">
            <Plus size={16} />
            New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {history.map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveChat(index)}
              className={`p-3 rounded-xl cursor-pointer text-sm transition ${
                activeChat === index
                  ? "bg-slate-800"
                  : "hover:bg-slate-800"
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400 text-center">
          © 2026 UniGen AI
        </div>
      </div>
    </>
  )
}

export default SideBar