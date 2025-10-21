import React from "react";
import { FaEdit } from "react-icons/fa";

interface ArticleFormHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

const ArticleFormHeader: React.FC<ArticleFormHeaderProps> = ({
  title,
  subtitle,
  icon = <FaEdit className="w-10 h-10" />,
}) => {
  return (
    <div className="bg-gradient-to-b from-primary to-primary-focus py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-primary-content">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg flex items-center justify-center gap-4">
            {icon}
            {title}
          </h1>
          <p className="text-xl opacity-90">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default ArticleFormHeader;
