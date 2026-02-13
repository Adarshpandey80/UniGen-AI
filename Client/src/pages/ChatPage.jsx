import { useOutletContext } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

function ChatPage() {
  const { selectedChat } = useOutletContext();
  const [chatData, setChatData] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      setChatData(selectedChat);
    }
  }, [selectedChat]);

  // Auto scroll to bottom when chat updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto space-y-6 py-6">

        {chatData ? (
          <>
            {/* USER MESSAGE */}
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-br-md max-w-[75%] shadow-md">
                <p className="text-sm whitespace-pre-wrap">
                  {chatData.request}
                </p>
              </div>
            </div>

            {/* AI MESSAGE */}
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-200 px-5 py-4 rounded-2xl rounded-bl-md max-w-[75%] shadow-md">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {chatData.response}
                </p>
              </div>
            </div>

            <div ref={bottomRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Select a chat from sidebar
          </div>
        )}
      </div>

    </div>
  );
}

export default ChatPage;
