import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

function Image() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const api = `${import.meta.env.VITE_API_URL}/user/request/image`;

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
        setError(null);

        try {
            const response = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: currentMessage }),
            });

            // Check if response is OK
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Check if response body exists
            if (!response.body) {
                throw new Error("Response body is null");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let aiText = "";

            // Add empty AI message
            setMessages((prev) => [...prev, { role: "ai", text: "", image: null }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const cleaned = chunk
                    .replace(/data: /g, "")
                    .replace(/\n\n/g, "");

                if (cleaned === "[DONE]") break;

                // Try to parse as JSON for image response
                try {
                    const data = JSON.parse(cleaned);
                    if (data.image) {
                        setMessages((prev) => {
                            const updated = [...prev];
                            updated[updated.length - 1].image = data.image;
                            return updated;
                        });
                    } else if (data.text) {
                        aiText += data.text;
                        setMessages((prev) => {
                            const updated = [...prev];
                            updated[updated.length - 1].text = aiText;
                            return updated;
                        });
                    }
                } catch {
                    // If not JSON, treat as text
                    aiText += cleaned;
                    setMessages((prev) => {
                        const updated = [...prev];
                        updated[updated.length - 1].text = aiText;
                        return updated;
                    });
                }
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
            // Remove the empty AI message on error
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && !error && (
                    <div className="text-center text-slate-500 mt-32">
                        Describe an image to generate
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl text-sm">
                        Error: {error}
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
                        {msg.text && <p>{msg.text}</p>}

                        {msg.image && (
                            <img
                                src={msg.image}
                                alt="AI Generated"
                                className="rounded-xl mt-2 max-w-full"
                            />
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="bg-slate-800 px-4 py-3 rounded-2xl w-fit text-sm animate-pulse">
                        Generating image...
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
                    <input
                        type="text"
                        placeholder="Describe an image to generate..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm"
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

export default Image;

