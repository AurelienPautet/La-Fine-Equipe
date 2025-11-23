import React, { Fragment } from "react";
import type { Message } from "@lafineequipe/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
const ChatMessage: React.FC<Message> = ({
  id,
  role,
  content,
  reasoningContent,
  timestamp,
}) => {
  const bgColor =
    role === "user"
      ? "bg-primary text-primary-content"
      : "bg-secondary text-secondary-content";
  const chatClass = role === "user" ? "chat-end" : "chat-start";

  const [isReasoningVisible, setIsReasoningVisible] = React.useState(false);

  const handleReasoningToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsReasoningVisible(e.target.checked);
  };
  return (
    <div key={id} className={`relative chat ${chatClass}`}>
      <div className={`chat-bubble ${bgColor}`}>
        {reasoningContent && reasoningContent !== "" && (
          <div className="collapse rounded-none ">
            <input type="checkbox" onChange={handleReasoningToggle} />
            <div
              className={`collapse-title pl-0 pb-1 ${
                !isReasoningVisible && "opacity-75  "
              }`}
            >
              Afficher le raisonnement:
              {isReasoningVisible ? (
                <FaArrowDown className="inline ml-2" />
              ) : (
                <FaArrowUp className="inline ml-2" />
              )}
            </div>
            <div className="collapse-content border-l-2  border-gray-300  pl-2">
              {reasoningContent.split("\n").map((line, index) => (
                <Fragment key={index}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {line}
                  </ReactMarkdown>
                  {index < reasoningContent.split("\n").length - 1 && (
                    <div className="h-2" />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        )}
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
