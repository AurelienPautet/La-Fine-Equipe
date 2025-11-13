import React from "react";
import { IoChatbubble } from "react-icons/io5";
import Popover from "./Popover";
import ChatDetail from "./ChatDetail";

const ChatButton: React.FC = () => {
  const [hasBeenClicked, setHasBeenClicked] = React.useState(false);

  return (
    <div className="fixed z-90 bottom-4 right-4">
      <Popover
        position="dropdown-top"
        align="dropdown-end"
        trigger={
          <>
            {!hasBeenClicked && (
              <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            )}

            <div
              className=" btn btn-primary btn-circle "
              onClick={() => setHasBeenClicked(true)}
            >
              <IoChatbubble />
            </div>
          </>
        }
      >
        <ChatDetail />
      </Popover>
    </div>
  );
};
export default ChatButton;
