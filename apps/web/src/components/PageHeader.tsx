import React, { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  children,
  className = "py-16",
}) => {
  return (
    <div
      className={`bg-gradient-to-b from-primary to-primary-focus ${className}`}
    >
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto text-secondary">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg flex items-center justify-center gap-4">
            {icon}
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-secondary opacity-80">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
