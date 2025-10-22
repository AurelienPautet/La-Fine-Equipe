import React from "react";
import { IoClose } from "react-icons/io5";
import { FaTag } from "react-icons/fa6";

interface TagDisplayProps {
  text: string;
  key?: string | number;
  onDelete?: () => void;
}

const TagDisplay: React.FC<TagDisplayProps> = ({ text, key, onDelete }) => {
  return (
    <div
      className="flex items-center gap-2 bg-white border-2 border-primary  rounded-xl"
      key={key}
    >
      <FaTag className="ml-2 text-primary" />
      <span className="font-medium">{text}</span>
      {onDelete && (
        <button
          className="btn btn-circle btn-xs m-0.5 bg-white border-0 hover:scale-105 transition-transform"
          onClick={onDelete}
          aria-label="Delete tag"
        >
          <IoClose className="text-base-content/60 w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default TagDisplay;
