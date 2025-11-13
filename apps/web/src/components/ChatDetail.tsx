import React, { useEffect, useState } from "react";
import type { Message } from "@lafineequipe/types";
import ChatMessage from "./ChatMessage";
import { IoSend } from "react-icons/io5";

import { usePostChatMessage } from "../hooks/ChatHooks";

const ChatDetail: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      content:
        "Bonjour je suis le lézardGPT de la fine équipe, comment puis je vous aider ? ",
      timestamp: Date.now(),
    },
  ]);

  const [waitingForResponse, setWaitingForResponse] = useState(false);

  const postChatMessageMutation = usePostChatMessage((chunk: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage && lastMessage.sender === "bot") {
        const updatedLastMessage = {
          ...lastMessage,
          content: lastMessage.content + chunk,
        };
        return [...prevMessages.slice(0, -1), updatedLastMessage];
      }
      return prevMessages;
    });
  });

  const scrollToBottom = () => {
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
    }
  };

  const createNewBotMessage = () => {
    const newBotMessage: Message = {
      id: (messages.length + 1).toString(),
      sender: "bot",
      content: "",
      timestamp: Date.now(),
    };
    setMessages((prevMessages) => [...prevMessages, newBotMessage]);
  };

  useEffect(() => {
    if (
      messages[messages.length - 1].sender === "user" ||
      messages[messages.length - 1].content === ""
    ) {
      scrollToBottom();
    }
  }, [messages]);

  const messagesDivRef = React.useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState("");

  const handlePostMessage = () => {
    setWaitingForResponse(true);
    const userMessage: Message = {
      id: (messages.length + 1).toString(),
      sender: "user",
      content: inputValue,
      timestamp: Date.now(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    createNewBotMessage();

    postChatMessageMutation.mutate([...messages, userMessage], {
      onSuccess: () => {
        setWaitingForResponse(false);
      },
    });
    setInputValue("");
  };

  return (
    <div className="mb-2 card w-screen  md:w-96 bg-base-200 shadow-lg p-4">
      <div className="card-body p-2">
        <h2 className="card-title">LézardGPT</h2>
        <div
          className="max-h-60 overflow-y-auto overflow-x-hidden"
          ref={messagesDivRef}
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} {...msg} />
          ))}
        </div>
        <form
          className="mt-2 flex flex-row gap-2 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handlePostMessage();
          }}
        >
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className={`btn btn-circle btn-primary ${
              inputValue.trim() === "" || waitingForResponse
                ? "btn-disabled"
                : ""
            }`}
            type="submit"
          >
            <IoSend />
          </button>
        </form>
      </div>
    </div>
  );
};
export default ChatDetail;
