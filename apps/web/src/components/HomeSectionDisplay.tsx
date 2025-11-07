import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import type { HomeSection } from "@lafineequipe/types";
import {
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import DeleteButton from "./DeleteButton";

interface HomeSectionDisplayProps {
  section: HomeSection;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const HomeSectionDisplay: React.FC<HomeSectionDisplayProps> = ({
  section,
  isAdmin = false,
  onEdit,
  onDelete,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}) => {
  return (
    <section className="py-20 bg-base-100 relative">
      <div className="container mx-auto px-4">
        {isAdmin && (
          <div className="flex justify-end gap-2 mb-4">
            {!isFirst && (
              <button
                onClick={onMoveUp}
                className="btn btn-sm btn-ghost"
                title="Monter"
              >
                <FaArrowUp className="w-4 h-4" />
              </button>
            )}
            {!isLast && (
              <button
                onClick={onMoveDown}
                className="btn btn-sm btn-ghost"
                title="Descendre"
              >
                <FaArrowDown className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onToggleVisibility}
              className={`btn btn-sm ${
                section.isVisible ? "btn-warning" : "btn-success"
              }`}
              title={section.isVisible ? "Masquer" : "Afficher"}
            >
              {section.isVisible ? (
                <FaEyeSlash className="w-4 h-4" />
              ) : (
                <FaEye className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onEdit}
              className="btn btn-sm btn-primary"
              title="Modifier"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <DeleteButton
              id={section.id}
              entityName={`la section "${section.title}"`}
              deleteMutation={async () => {
                await onDelete?.();
              }}
              className="btn-sm"
              confirmMessage={`Êtes-vous sûr de vouloir supprimer la section "${section.title}" ? Cette action est irréversible.`}
            />
          </div>
        )}

        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-secondary mb-4">
            {section.title}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {section.imageUrl && (
            <div className="lg:col-span-1">
              <img
                src={section.imageUrl}
                alt={section.title}
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          )}

          <div
            className={`prose prose-lg max-w-none ${
              section.imageUrl ? "lg:col-span-2" : "lg:col-span-3"
            }`}
          >
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {section.content}
            </ReactMarkdown>
          </div>
        </div>

        {section.buttonLabel && section.buttonLink && (
          <div className="text-center mt-8">
            <a
              href={section.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              {section.buttonLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeSectionDisplay;
