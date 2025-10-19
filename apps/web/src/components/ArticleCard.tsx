import React from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaArrowRight,
  FaUser,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";
import type { ArticleWithTags } from "@lafineequipe/types";

const ArticleCard: React.FC<{
  article: ArticleWithTags | undefined;
  className?: string;
  loading?: boolean;
}> = ({ article, loading = false, className }) => {
  if (loading) {
    return (
      <div
        className={`card  bg-base-100 shadow-xl border-2 border-primary/20 h-64 ${className}`}
      >
        <div className="card-body flex flex-col justify-between h-full p-6">
          <div className="flex items-start gap-3">
            <div className="skeleton h-8 w-8 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 min-w-0 space-y-4">
              <div className="skeleton h-6 w-3/4"></div>
              <div className="skeleton h-6 w-1/2"></div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-2/3"></div>
                <div className="skeleton h-4 w-1/2"></div>
                <div className="skeleton h-4 w-3/4"></div>
              </div>
            </div>
          </div>
          <div className="card-actions justify-end mt-4">
            <div className="skeleton h-8 w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div
      className={`card  bg-base-100 shadow-xl border-2 border-primary/20 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 transform hover:scale-105 h-64 ${className}`}
    >
      <div className="card-body flex flex-col justify-between h-full p-6">
        <div className="flex items-start gap-3">
          <div className="badge badge-primary badge-lg flex-shrink-0">
            <FaEdit className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            {/* Fixed height title with truncation */}
            <h2 className="card-title text-secondary text-xl mb-3 h-14 line-clamp-2">
              {article.title || "Article sans titre"}
            </h2>

            {/* Metadata Section with fixed space */}
            <div className="space-y-2 h-20 overflow-hidden">
              {/* Author */}
              {article.author && (
                <div className="flex items-center gap-2 text-base-content/60">
                  <FaUser className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="text-sm truncate">{article.author}</span>
                </div>
              )}

              {/* Date */}
              {article.date && (
                <div className="flex items-center gap-2 text-base-content/60">
                  <FaCalendarAlt className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="text-sm truncate">
                    {new Date(article.date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Tags with fixed height and overflow handling */}
              {article.tags.length > 0 && (
                <div className="flex items-start gap-2 text-base-content/60">
                  <FaTag className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1 overflow-hidden max-h-8">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="badge badge-primary badge-xs flex-shrink-0"
                      >
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="badge badge-primary badge-xs flex-shrink-0">
                        +{article.tags.length - 3}
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
            to={`/article/${article.slug}`}
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
