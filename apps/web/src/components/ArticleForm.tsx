import React, { useEffect, useState } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import { useUploadFile } from "../hooks/FileHooks";
import {
  FaEdit,
  FaSave,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaTag,
} from "react-icons/fa";
import ArticleDisplay from "./ArticleDisplay";
import "cally";
import type {
  ArticleWithTags,
  CreateArticleRequest,
  EditArticleRequest,
} from "@lafineequipe/types";
import TagSelector from "./TagSelector";

interface ArticleFormProps {
  initialData: CreateArticleRequest | EditArticleRequest | ArticleWithTags;
  onSubmit: (data: CreateArticleRequest | EditArticleRequest) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
  submitButtonLoadingText: string;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText,
  submitButtonLoadingText,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formData, setFormData] = useState<
    CreateArticleRequest | EditArticleRequest
  >({
    ...initialData,
    tagsId: initialData.tagsId || [],
  });

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    noClick: true,
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles),
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.name} className="text-sm">
      {file.name} - {file.size} bytes
    </li>
  ));

  const uploadMutation = useUploadFile("articles");

  const handleDrop = async (acceptedFiles: readonly FileWithPath[]) => {
    const result = await Promise.all(
      acceptedFiles.map((file) => uploadMutation.mutateAsync(file))
    );
    console.log("Uploaded files:", result);
    for (const res of result) {
      let stringToInsert = "";
      if (res.type.startsWith("image/")) {
        stringToInsert = `\n<img src="${res.url}" alt="${res.name}" />\n`;
      } else if (res.type === "application/pdf") {
        stringToInsert = `\n<embed src="${res.url}" type="application/pdf" width="100%" height="600px" />\n`;
      }

      setFormData((prev) => ({
        ...prev,
        content: prev.content + stringToInsert,
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Mode Toggle - Mobile Only */}
      <div className="flex justify-center mb-8 lg:hidden">
        <div className="btn-group">
          <button
            className={`btn ${
              !isPreviewMode ? "btn-primary" : "btn-outline btn-primary"
            } flex items-center gap-2`}
            onClick={() => setIsPreviewMode(false)}
          >
            <FaEdit className="w-4 h-4" />
            Édition
          </button>
          <button
            className={`btn ${
              isPreviewMode ? "btn-primary" : "btn-outline btn-primary"
            } flex items-center gap-2`}
            onClick={() => setIsPreviewMode(true)}
          >
            <FaEye className="w-4 h-4" />
            Aperçu
          </button>
        </div>
      </div>

      {/* Desktop: Side by side, Mobile: Toggle */}
      <div className="grid lg:grid-cols-2 gap-8 lg:h-[800px]">
        {/* Edit Form - Always visible on desktop, conditional on mobile */}
        <div
          className={`h-full ${isPreviewMode ? "hidden lg:block" : "block"}`}
        >
          <div className="card bg-base-100 shadow-2xl border-2 border-primary/20 h-full flex flex-col">
            <div className="card-body p-6 lg:p-8 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-6 flex-shrink-0">
                <FaEdit className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-secondary">Édition</h2>
              </div>
              <form
                onSubmit={handleSubmit}
                className="space-y-6 flex-1 flex flex-col overflow-hidden"
              >
                {/* Title */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold flex items-center gap-2">
                      <FaEdit className="w-4 h-4" />
                      Titre de l'article
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input input-bordered input-primary text-lg"
                    placeholder="Entrez le titre de votre article..."
                    required
                  />
                </div>

                {/* Author and Date */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <FaUser className="w-4 h-4" />
                        Auteur
                      </span>
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="input input-bordered input-primary"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4" />
                        Date de publication
                      </span>
                    </label>
                    <button
                      popoverTarget="cally-popover1"
                      className="input input-bordered input-primary w-full text-left"
                      id="cally1"
                      style={{ "anchor-name": "--cally1" } as any}
                      type="button"
                    >
                      {formData.date
                        ? new Date(formData.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Choisir une date"}
                    </button>
                    <div
                      popover=""
                      id="cally-popover1"
                      className="dropdown bg-base-100 rounded-box shadow-lg border border-base-300"
                      style={{ "position-anchor": "--cally1" } as any}
                    >
                      <calendar-date
                        className="cally"
                        onchange={(e: any) => {
                          setFormData((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }));
                        }}
                        value={
                          new Date(formData.date).toISOString().split("T")[0]
                        }
                      >
                        <svg
                          aria-label="Previous"
                          className="fill-current size-4"
                          slot="previous"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          {...({} as any)}
                        >
                          <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
                        </svg>
                        <svg
                          aria-label="Next"
                          className="fill-current size-4"
                          slot="next"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          {...({} as any)}
                        >
                          <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                        </svg>
                        <calendar-month></calendar-month>
                      </calendar-date>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <TagSelector />

                <div className="flex-1 flex flex-col min-h-0">
                  {/* Content */}
                  <div
                    {...getRootProps({
                      className: "form-control flex-1 flex flex-col dropzone",
                    })}
                  >
                    <label className="label">
                      <span className="label-text font-semibold">
                        Contenu (écrit en Markdown)
                      </span>
                    </label>
                    <input {...getInputProps()} />

                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      className="mt-3 textarea textarea-bordered textarea-primary w-full flex-1 font-mono resize-none"
                      placeholder="Écrivez votre article ici...

Vous pouvez utiliser du Markdown :
- **texte en gras**
- *texte en italique*
- [liens](https://example.com)
- `code`
- etc."
                      required
                    />
                  </div>
                </div>
                <ul>{files}</ul>

                {/* Submit Button */}
                <div className="card-actions justify-end pt-6 flex-shrink-0">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        {submitButtonLoadingText}
                      </>
                    ) : (
                      <>
                        <FaSave className="w-5 h-5" />
                        {submitButtonText}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Preview - Always visible on desktop, conditional on mobile */}
        <div
          className={`h-full ${!isPreviewMode ? "hidden lg:block" : "block"}`}
        >
          <div className="card bg-base-100 shadow-2xl border-2 border-primary/20 h-full flex flex-col">
            <div className="card-body p-6 lg:p-8 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-6 flex-shrink-0">
                <FaEye className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-secondary">Aperçu</h2>
              </div>
              <div className="overflow-y-auto flex-1 border rounded-lg p-4 bg-base-50">
                <ArticleDisplay
                  metadata={{
                    title: formData.title,
                    author: formData.author,
                    date: new Date(formData.date).toISOString().split("T")[0],
                    tags: formData.tags || [],
                  }}
                  content={formData.content}
                  isPreview={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleForm;
