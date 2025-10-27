import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { FaCalendarAlt, FaPen } from "react-icons/fa";

interface RegulationMetadata {
  title: string;
  description: string | undefined | null;
  date: Date;
}

interface RegulationDisplayProps {
  metadata: RegulationMetadata;
  content: string;
  isPreview?: boolean;
}

const RegulationDisplay: React.FC<RegulationDisplayProps> = ({
  metadata,
  content,
  isPreview = false,
}) => {
  return (
    <article className="w-full">
      {/* Regulation Header */}
      <header className="mb-8 pb-6 border-b border-base-300">
        {/* Title */}
        <h1
          className={`font-bold text-secondary mb-4 ${
            isPreview ? "text-2xl lg:text-3xl" : "text-3xl lg:text-4xl"
          }`}
        >
          {metadata.title || "Titre du règlement"}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm lg:text-base text-base-content/70">
          {/* Description */}
          {metadata.description && (
            <div className="flex items-center gap-2">
              <FaPen className="w-4 h-4 text-primary" />
              <span>{metadata.description}</span>
            </div>
          )}

          {/* Date */}
          {metadata.date && (
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="w-4 h-4 text-primary" />
              <span>
                {new Date(metadata.date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Regulation Content */}
      <div
        className={`prose max-w-none prose-headings:text-secondary prose-a:text-primary hover:prose-a:text-primary-focus prose-strong:text-secondary prose-code:bg-primary/10 prose-code:text-primary prose-code:px-2 prose-code:py-1 prose-code:rounded ${
          isPreview ? "prose-sm lg:prose-base" : "prose-lg"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {content || "*Votre contenu apparaîtra ici...*"}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default RegulationDisplay;
