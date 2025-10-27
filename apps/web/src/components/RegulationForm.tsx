import React, { useEffect, useState } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import { useUploadFile, useDeleteFile } from "../hooks/FileHooks";
import { FaEdit, FaSave, FaEye, FaUser } from "react-icons/fa";
import RegulationDisplay from "./RegulationDisplay";
import DateTimePicker from "./DateTimePicker";
import "cally";
import type {
  Regulation,
  CreateRegulationRequest,
  EditRegulationRequest,
} from "@lafineequipe/types";

interface RegulationFormProps {
  initialData: CreateRegulationRequest | EditRegulationRequest | Regulation;
  onSubmit: (
    data: CreateRegulationRequest | EditRegulationRequest
  ) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
  submitButtonLoadingText: string;
}

const RegulationForm: React.FC<RegulationFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText,
  submitButtonLoadingText,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formData, setFormData] = useState<
    CreateRegulationRequest | EditRegulationRequest
  >({
    ...initialData,
  });

  const ensureValidDate = (date: Date | undefined | null): Date => {
    if (!date) return new Date();
    const d = new Date(date);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const { getRootProps, getInputProps } = useDropzone({
    noClick: true,
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles),
  });

  const handleDrop = async (acceptedFiles: readonly FileWithPath[]) => {
    const result = await Promise.all(
      acceptedFiles.map((file) => uploadMutation.mutateAsync(file))
    );
    console.log("Uploaded files:", result);

    setUploadedFiles((prev) => [...prev, ...result.map((res) => res.url)]);

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

  const uploadMutation = useUploadFile("regulations");
  const deleteMutation = useDeleteFile();

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  useEffect(() => {
    const embedRegex = /<embed src="([^"]+)"[^>]*>/g;
    const imgRegex = /<img src="([^"]+)"[^>]*>/g;
    const embedMatches = [...(initialData.content.matchAll(embedRegex) || [])];
    const imgMatches = [...(initialData.content.matchAll(imgRegex) || [])];
    const extractedUrls = [
      ...embedMatches.map((match) => match[1]),
      ...imgMatches.map((match) => match[1]),
    ];
    setUploadedFiles(extractedUrls);
  }, [initialData]);

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
    for (const fileUrl of uploadedFiles) {
      if (!formData.content.includes(fileUrl)) {
        deleteMutation.mutate(fileUrl);
      }
    }
    await onSubmit(formData);
  };

  return (
    <div className="max-w-6xl h-full">
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
      <div className="grid lg:grid-cols-2 gap-8 h-fit lg:h-min-[1600px]">
        {/* Edit Form - Always visible on desktop, conditional on mobile */}
        <div
          className={`h-full ${isPreviewMode ? "hidden lg:block" : "block"}`}
        >
          <div className="card bg-base-100 shadow-2xl border-2 border-primary/20 h-full flex flex-col">
            <div className="card-body lg:p-8 flex flex-col h-full">
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
                      Titre du règlement
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input input-bordered input-primary text-lg"
                    placeholder="Entrez le titre du règlement..."
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
                </div>

                {/* Date Picker */}
                <DateTimePicker
                  label="Date de publication"
                  value={formData.date}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, date: date }))
                  }
                />

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
                      className="mt-3 textarea textarea-bordered textarea-primary min-h-72 w-full flex-1 font-mono resize-none"
                      placeholder="Écrivez le contenu du règlement ici...

Vous pouvez utiliser du Markdown :
- # Titre de niveau 1 
- **texte en gras**
- *texte en italique*
- [liens](https://example.com)
- `code`
- voir plus bas pour le guide du Markdown.

Déposez des fichiers (pdf et images) pour les insérer directement dans le contenu !
"
                      required
                    />
                  </div>
                </div>

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
                <RegulationDisplay
                  metadata={{
                    title: formData.title,
                    author: formData.author,
                    date: ensureValidDate(formData.date),
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

export default RegulationForm;
