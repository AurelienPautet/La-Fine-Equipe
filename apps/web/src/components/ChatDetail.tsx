import React, { useState, useEffect } from "react";
import type { Message } from "@lafineequipe/types";
import ChatMessage from "./ChatMessage";
import { IoSend } from "react-icons/io5";
const ChatDetail: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      content:
        "Bonjour ! Je suis là pour vous aider. Comment puis-je vous assister aujourd'hui ?",
      timestamp: Date.now(),
    },
    {
      id: "2",
      sender: "user",
      content:
        "Bonjour ! Pouvez-vous me donner des informations sur vos services ?",
      timestamp: Date.now(),
    },
    {
      id: "3",
      sender: "bot",
      content:
        "Bien sûr ! Nous offrons une variété de services adaptés à vos besoins. N'hésitez pas à poser des questions spécifiques.",
      timestamp: Date.now(),
    },
  ]);

  return (
    <div className="mb-2 card w-64 bg-accent shadow-lg p-4">
      <div className="card-body p-2">
        <h2 className="card-title">Chat</h2>
        <div className="max-h-60 overflow-y-auto">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} {...msg} />
          ))}
        </div>
        <div className="mt-2 flex flex-row gap-2 items-center">
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Type your message..."
          />
          <button className="btn btn-circle btn-primary ">
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatDetail;
