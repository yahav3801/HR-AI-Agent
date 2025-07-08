import React, { useEffect, useRef, useState } from "react";

const ChatBox = ({
  setIsShown,
  fetchEmployees,
}: {
  setIsShown: (shown: boolean) => void;
  fetchEmployees: () => void;
}) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI agent. How can I help you today?",
      sender: "ai",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!text.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setText("");
    setIsTyping(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/chat/3801`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const aiMessage = {
        id: messages.length + 2,
        text: data.response,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
      fetchEmployees();
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "An error occurred while processing your request.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main className="flex flex-col md:w-[600px] w-full max-w-2xl mx-auto md:h-[80vh] h-96 bg-stone-50 shadow-xl border border-gray-200 rounded-2xl">
      <header className="rounded-t-2xl bg-neutral-800 shadow-md text-white font-bold border-b border-gray-200">
        <div className="flex justify-between items-center p-4">
          <h3>HR AI Agent</h3>
          <button
            onClick={() => setIsShown(false)}
            className="bg-white text-neutral-800 px-2 cursor-pointer rounded-full hover:bg-orange-500 hover:text-white transition"
          >
            X
          </button>
        </div>
      </header>

      <div className="bg-neutral-100 flex flex-1 flex-col gap-2 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-bubble shadow-md ${
              message.sender === "ai" ? "agent-message" : "user-message"
            }`}
          >
            {message.text}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-end">
            <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-br-md shadow-sm px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      <div className="flex justify-around p-4 h-16 border-t border-gray-200 bg-white rounded-b-2xl gap-4 resize-none focus:outline-none">
        <textarea
          className="overflow-hidden w-full px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          rows={1}
          onKeyDown={handleKeyPress}
          style={{ minHeight: "40px", maxHeight: "120px" }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!text.trim() || isTyping}
          className="px-4 py-5 bg-orange-500 hover:bg-orange-600 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          Send
        </button>
      </div>
    </main>
  );
};

export default ChatBox;
