import React, { useRef, useEffect } from "react";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  dropdownClassName?: string;
  position?:
    | "dropdown-top"
    | "dropdown-bottom"
    | "dropdown-left"
    | "dropdown-right";
  align?: "dropdown-start" | "dropdown-end" | "";
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  className = "",
  dropdownClassName = "",
  position = "dropdown-bottom",
  align = "",
}) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        detailsRef.current.open = false;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <details
      className={`dropdown ${position} ${align} ${className}`}
      ref={detailsRef}
    >
      <summary className="cursor-pointer list-none" role="button">
        {trigger}
      </summary>
      <div className={`dropdown-content z-[10] ${dropdownClassName}`}>
        {children}
      </div>
    </details>
  );
};

export default Popover;
