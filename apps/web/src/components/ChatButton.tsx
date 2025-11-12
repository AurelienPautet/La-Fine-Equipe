import React from "react";
import { IoChatbubble } from "react-icons/io5";
import Popover from "./Popover";
import ChatDetail from "./ChatDetail";

const ChatButton: React.FC = () => {
  const handleClick = () => {
    // Logic to open chat window or redirect to chat page
    console.log("Chat button clicked");
  };
  return (
    <div className="fixed z-90 bottom-4 right-4">
      <Popover
        position="dropdown-top"
        align="dropdown-end"
        trigger={
          <div className=" btn btn-primary btn-circle" onClick={handleClick}>
            <IoChatbubble />
          </div>
        }
      >
        <ChatDetail />
      </Popover>
    </div>
  );
};
export default ChatButton;
