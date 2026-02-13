import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

function Text() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const api = `${import.meta.env.VITE_API_URL}/user/request/text`;


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = input;
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMessage }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Streaming not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let aiText = "";


      setMessages((prev) => [...prev, { role: "ai", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

   
        const lines = chunk.split("\n");

        for (let line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.replace("data: ", "").trim();

            if (data === "[DONE]") {
              setLoading(false);
              return;
            }

            aiText += data;

            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1].text = aiText;
              return updated;
            });
          }
        }
      }

    } catch (err) {
      console.error("UI Error:", err);
      setError(err.message);

    
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 to-black text-white">

  {/* Messages */}
  <div className="flex-1 overflow-y-auto p-6 space-y-4">
    {messages.length === 0 && !error && (
      <div className="text-center text-slate-500 mt-40 text-lg">
        Ask anything to <span className="text-blue-500 font-semibold">UniGen AI</span>
      </div>
    )}

    {error && (
      <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl text-sm">
        ⚠ {error}
      </div>
    )}

    {messages.map((msg, index) => (
      <div
        key={index}
        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`inline-block px-4 py-2 rounded-2xl shadow-md
            ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-md" : "bg-slate-800 text-slate-200 rounded-bl-md"}
          `}
          style={{ maxWidth: "60%", width: "fit-content" }}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {msg.text}
          </p>
        </div>
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
      className="flex items-center gap-3 bg-slate-800 rounded-2xl px-4 py-2 shadow-lg"
    >
      <input
        type="text"
        placeholder="Message UniGen AI..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm placeholder-slate-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 transition p-2 rounded-xl disabled:opacity-50"
      >
        <Send size={18} />
      </button>
    </form>
  </div>
</div>

  );
}

export default Text;
