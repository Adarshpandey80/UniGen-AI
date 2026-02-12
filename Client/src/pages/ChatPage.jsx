import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const api = `${import.meta.env.VITE_API_URL}/user/request`;

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let aiText = "";

      // Add empty AI message
      setMessages((prev) => [...prev, { role: "ai", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const cleaned = chunk
          .replace(/data: /g, "")
          .replace(/\n\n/g, "");

        if (cleaned === "[DONE]") break;

        aiText += cleaned;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = aiText;
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-32">
            Ask anything to UniGen AI
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-2xl px-5 py-3 rounded-2xl text-sm shadow ${
              msg.role === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-slate-800"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="bg-slate-800 px-4 py-3 rounded-2xl w-fit text-sm animate-pulse">
            AI is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 bg-slate-800 rounded-2xl px-4 py-2"
        >
          <select name="" id="">
            <option value="">Text</option>
            <option value="">Image</option>
            <option value="">Vide</option>
          </select>
          <input
            type="text"
            placeholder="Message UniGen AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 transition p-2 rounded-xl"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
