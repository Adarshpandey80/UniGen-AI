import { useOutletContext } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

function ChatPage() {
  const { selectedChat } = useOutletContext();
  const [chatData, setChatData] = useState(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const api = `${import.meta.env.VITE_API_URL}/user/chatUpdate`;

  // Load selected chat
  useEffect(() => {
    if (selectedChat) {
      setChatData(selectedChat);
    }
  }, [selectedChat]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);

  // ✅ SEND MESSAGE
  const handleSend = async (e) => {
  e.preventDefault();
  if (!input.trim()) return;

  const userMessage = input;
  setInput("");

  // 🔥 Show user message instantly
  setChatData(prev => ({
    ...prev,
    request: [...prev.request, userMessage],
    response: [...prev.response, ""], // empty AI response for streaming
  }));

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/user/chatUpdate/${chatData._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    }
  );

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    for (let line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.replace("data: ", "").trim();

        if (data === "[DONE]") return;

        try {
          const parsed = JSON.parse(data);

          if (parsed.text) {
            setChatData(prev => {
              const updatedResponses = [...prev.response];
              updatedResponses[updatedResponses.length - 1] += parsed.text;

              return {
                ...prev,
                response: updatedResponses,
              };
            });
          }
        } catch (err) {
          console.error("Parse error:", err);
        }
      }
    }
  }
};


  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 py-6 px-4">

        {chatData ? (
          <>
            {chatData.request.map((req, index) => (
              <div key={index} className="space-y-3">

                {/* USER MESSAGE */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-br-md max-w-[75%] shadow-md">
                    <p className="text-sm whitespace-pre-wrap">
                      {req}
                    </p>
                  </div>
                </div>

                {/* AI MESSAGE */}
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-200 px-5 py-4 rounded-2xl rounded-bl-md max-w-[75%] shadow-md">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {chatData.response[index]}
                    </p>
                  </div>
                </div>

              </div>
            ))}

            <div ref={bottomRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Select a chat from sidebar
          </div>
        )}
      </div>

      {/* Input Box */}
      {chatData && (
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-slate-700 flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-xl outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 px-5 py-2 rounded-xl text-white hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      )}

    </div>
  );
}

export default ChatPage;
