import React from "react";
import type { Message } from "@lafineequipe/types";

const ChatMessage: React.FC<Message> = ({ id, sender, content, timestamp }) => {
  const bgColor =
    sender === "user"
      ? "bg-primary text-primary-content"
      : "bg-secondary text-secondary-content";
  const alignClass = sender === "user" ? "justify-end" : "justify-start";

  return (
    <div className={`flex flex-row ${alignClass} `}>
      <div
        className={`chat-message my-1 p-2 w-3/4 rounded-lg max-w-xs ${bgColor} `}
      >
        <p className="text-sm">{content}</p>
        <span className="text-xs text-gray-200 mt-1 block">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
