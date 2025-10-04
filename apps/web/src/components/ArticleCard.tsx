import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaArrowRight,
  FaUser,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";
import { fetchArticleMetadata } from "../utils/articleUtils";

interface ArticleCardProps {
  slug: string;
}

interface PostMetadata {
  title: string;
  author: string;
  date: string;
  tags: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ slug }) => {
  const [postMetadata, setPostMetadata] = useState<PostMetadata | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const metadata = await fetchArticleMetadata(slug);
        setPostMetadata(metadata);
      } catch (error) {
        console.error(`Error fetching metadata for ${slug}:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, [slug]);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl border-2 border-primary/20 animate-pulse">
        <div className="card-body">
          <div className="h-6 bg-base-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-base-300 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-base-300 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const tags = postMetadata ? parseTags(postMetadata.tags) : [];

  return (
    <div className="card bg-base-100 shadow-xl border-2 border-primary/20 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 transform hover:scale-105 h-64">
      <div className="card-body flex flex-col justify-between h-full p-6">
        <div className="flex items-start gap-3">
          <div className="badge badge-primary badge-lg flex-shrink-0">
            <FaEdit className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            {/* Fixed height title with truncation */}
            <h2 className="card-title text-secondary text-xl mb-3 h-14 line-clamp-2">
              {postMetadata?.title || "Article sans titre"}
            </h2>

            {/* Metadata Section with fixed space */}
            <div className="space-y-2 h-20 overflow-hidden">
              {/* Author */}
              {postMetadata?.author && (
                <div className="flex items-center gap-2 text-base-content/60">
                  <FaUser className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="text-sm truncate">
                    {postMetadata.author}
                  </span>
                </div>
              )}

              {/* Date */}
              {postMetadata?.date && (
                <div className="flex items-center gap-2 text-base-content/60">
                  <FaCalendarAlt className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="text-sm truncate">
                    {formatDate(postMetadata.date)}
                  </span>
                </div>
              )}

              {/* Tags with fixed height and overflow handling */}
              {tags.length > 0 && (
                <div className="flex items-start gap-2 text-base-content/60">
                  <FaTag className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1 overflow-hidden max-h-8">
                    {tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="badge badge-primary badge-xs flex-shrink-0"
                      >
                        {tag}
                      </span>
                    ))}
                    {tags.length > 3 && (
                      <span className="badge badge-primary badge-xs flex-shrink-0">
                        +{tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed position button at bottom */}
        <div className="card-actions justify-end mt-4">
          <Link
            to={`/blog/${slug}`}
            className="btn btn-primary btn-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
          >
            Lire l'article
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
