import React, { Fragment } from "react";
import type { Message } from "@lafineequipe/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
const ChatMessage: React.FC<Message> = ({ id, sender, content, timestamp }) => {
  const bgColor =
    sender === "user"
      ? "bg-primary text-primary-content"
      : "bg-secondary text-secondary-content";
  const chatClass = sender === "user" ? "chat-end" : "chat-start";

  return (
    <div key={id} className={`relative chat ${chatClass}`}>
      <div className={`chat-bubble ${bgColor}`}>
        {content !== "" ? (
          <div>
            {content.split("\n").map((line, index) => (
              <Fragment key={index}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {line}
                </ReactMarkdown>
                {index < content.split("\n").length - 1 && (
                  <div className="h-2" />
                )}
              </Fragment>
            ))}
          </div>
        ) : (
          <span className="loading loading-dots loading-xs"></span>
        )}
        <span className=" text-xs text-gray-200 mt-1 block">
          {new Date(timestamp).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      {/* {sender === "bot" && (
        <img src="/LFE_lézard_nu_2.png" className="w-5 absolute bottom-0" />
      )} */}
    </div>
  );
};

export default ChatMessage;
