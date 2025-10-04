import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaUser, FaCalendarAlt, FaTag } from "react-icons/fa";

interface ArticleMetadata {
  title: string;
  author: string;
  date: string;
  tags: string;
}

interface ArticleDisplayProps {
  metadata: ArticleMetadata;
  content: string;
  isPreview?: boolean;
}

const ArticleDisplay: React.FC<ArticleDisplayProps> = ({
  metadata,
  content,
  isPreview = false,
}) => {
  // Parse tags if they're in array format [tag1, tag2] or comma-separated
  const parseTags = (tagsString: string): string[] => {
    if (!tagsString) return [];

    // Remove brackets and split by comma
    const cleanTags = tagsString
      .replace(/[\[\]]/g, "")
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    return cleanTags;
  };

  const tags = parseTags(metadata.tags);

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  return (
    <article className="w-full">
      {/* Article Header */}
      <header className="mb-8 pb-6 border-b border-base-300">
        {/* Title */}
        <h1
          className={`font-bold text-secondary mb-4 ${
            isPreview ? "text-2xl lg:text-3xl" : "text-3xl lg:text-4xl"
          }`}
        >
          {metadata.title || "Titre de l'article"}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm lg:text-base text-base-content/70">
          {/* Author */}
          {metadata.author && (
            <div className="flex items-center gap-2">
              <FaUser className="w-4 h-4 text-primary" />
              <span>{metadata.author}</span>
            </div>
          )}

          {/* Date */}
          {metadata.date && (
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="w-4 h-4 text-primary" />
              <span>{formatDate(metadata.date)}</span>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-2">
              <FaTag className="w-4 h-4 text-primary" />
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <span key={index} className="badge badge-primary badge-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Article Content */}
      <div
        className={`prose max-w-none prose-headings:text-secondary prose-a:text-primary hover:prose-a:text-primary-focus prose-strong:text-secondary prose-code:bg-primary/10 prose-code:text-primary prose-code:px-2 prose-code:py-1 prose-code:rounded ${
          isPreview ? "prose-sm lg:prose-base" : "prose-lg"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content || "*Votre contenu apparaîtra ici...*"}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default ArticleDisplay;
