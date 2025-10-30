import React, { useEffect, useState, useCallback } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import { useUploadFile, useDeleteFile } from "../hooks/FileHooks";
import { FaEdit, FaSave, FaEye, FaUser, FaImage } from "react-icons/fa";
import EventsDisplay from "./EventDisplay";
import DateTimePicker from "./DateTimePicker";
import UploadFileButton from "./UploadFileButton";
import "cally";
import type {
  EventsWithTags,
  CreateEventsRequest,
  EditEventsRequest,
  Tag,
} from "@lafineequipe/types";
import TagSelector from "./TagSelector";
import { FaLocationPin, FaUserGroup } from "react-icons/fa6";
interface EventsFormProps {
  initialData: CreateEventsRequest | EditEventsRequest | EventsWithTags;
  onSubmit: (data: CreateEventsRequest | EditEventsRequest) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
  submitButtonLoadingText: string;
}

const EventsForm: React.FC<EventsFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText,
  submitButtonLoadingText,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formData, setFormData] = useState<
    CreateEventsRequest | EditEventsRequest
  >({
    ...initialData,
    tags: initialData.tags || [],
    maxAttendees: initialData.maxAttendees ?? undefined,
    thumbnailUrl: initialData.thumbnailUrl ?? undefined,
  });

  const ensureValidDate = (date: Date | undefined | null): Date => {
    if (!date) return new Date();
    const d = new Date(date);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const initialTags = initialData.tags || [];

  const { getRootProps, getInputProps } = useDropzone({
    noClick: true,
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles),
  });

  const handleDrop = async (
    acceptedFiles: readonly FileWithPath[],
    type: "thumbnail" | "file" = "file"
  ) => {
    const result = await Promise.all(
      acceptedFiles.map((file) => uploadMutation.mutateAsync(file))
    );
    console.log("Uploaded files:", result);

    if (type === "thumbnail") {
      if (formData.thumbnailUrl != "" && formData.thumbnailUrl) {
        if (formData.thumbnailUrl.includes(".blob.vercel-storage.com")) {
          deleteMutation.mutate(formData.thumbnailUrl as string);
        }
        formData.thumbnailUrl = "";
      }

      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: result[0]?.url,
      }));
      return;
    }

    for (const res of result) {
      handleFileUpload(res.url, res.type, res.name);
    }
  };

  const handleFileUpload = (url: string, type: string, name: string) => {
    setUploadedFiles((prev) => [...prev, url]);
    let stringToInsert = "";
    if (type.startsWith("image/")) {
      stringToInsert = `\n<img src="${url}" alt="${name}" />\n`;
    } else if (type === "application/pdf") {
      stringToInsert = `\n<embed src="${url}" type="application/pdf" width="100%" height="600px" />\n`;
    }

    setFormData((prev) => ({
      ...prev,
      content: prev.content + stringToInsert,
    }));
  };

  const uploadMutation = useUploadFile("events");
  const deleteMutation = useDeleteFile();

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  useEffect(() => {
    const embedRegex = /<embed src="([^"]+)"[^>]*>/g;
    const matches = [...(initialData.content.matchAll(embedRegex) || [])];
    const extractedUrls = matches.map((match) => match[1]);
    setUploadedFiles(extractedUrls);
  }, [initialData]);

  const setTags = useCallback((tags: Tag[]) => {
    setFormData((prev) => ({
      ...prev,
      tags,
    }));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name } = target;

    let value: string | number | undefined = (
      e.target as HTMLInputElement | HTMLTextAreaElement
    ).value;

    if ("type" in target && target.type === "number") {
      value = target.value === "" ? undefined : Number(target.value);
    }

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
    <div className="max-w-6xl  h-full">
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
            <div className="card-body  lg:p-8 flex flex-col h-full">
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
                      Titre de l'évenemnt
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input input-bordered input-primary text-lg"
                    placeholder="Entrez le titre de votre events..."
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

                {/* Start Date and Time Picker */}
                <DateTimePicker
                  label="Date et heure de début de l'événement"
                  value={formData.startDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, startDate: date }))
                  }
                />

                {/* End Date and Time Picker */}
                <DateTimePicker
                  label="Date et heure de fin de l'événement"
                  value={formData.endDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, endDate: date }))
                  }
                />

                {/* Location */}
                <div className="form-control flex flex-col gap-1">
                  <label className="label">
                    <span className="label-text text-sm font-semibold flex items-center gap-2">
                      <FaLocationPin className="w-4 h-4" />
                      Lieu de l'évenemnt
                    </span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input input-bordered input-primary text-sm"
                    placeholder="Manufacture des Tabacs"
                    required
                  />
                </div>

                {/* Max Attendees */}
                <div className="form-control flex flex-col gap-1">
                  <label className="label">
                    <span className="label-text text-sm font-semibold flex items-center gap-2">
                      <FaUserGroup className="w-4 h-4" />
                      Nombre maximum de participants (optionnel)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    className="input input-bordered input-primary text-sm"
                    placeholder="laissez vide pour illimité"
                    min={1}
                  />
                </div>

                {/* Tags */}
                <TagSelector initialTags={initialTags} setTags={setTags} />

                {/* Thumbnail URL */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-sm font-semibold flex items-center gap-2">
                      <FaImage className="w-4 h-4" />
                      URL de la miniature de l'évènement (optionnel)
                    </span>
                  </label>
                  <div className="flex flex-row items-center gap-2">
                    <UploadFileButton
                      folder="events"
                      onFileUploaded={(url) =>
                        setFormData((prev) => ({
                          ...prev,
                          thumbnailUrl: url,
                        }))
                      }
                      buttonText="Télécharger une miniature"
                    />
                    <input
                      type="text"
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl || ""}
                      onChange={handleInputChange}
                      className="input input-bordered input-primary text-sm flex-1"
                      placeholder="Ou collez une URL de miniature..."
                    />
                  </div>
                </div>

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

                    <UploadFileButton
                      onFileUploaded={handleFileUpload}
                      folder="events"
                      className="mb-4 self-start"
                      buttonText="Ajouter un fichier au contenu"
                    />

                    <input {...getInputProps()} />

                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      className="mt-3 textarea textarea-bordered textarea-primary min-h-72 w-full flex-1 font-mono resize-none"
                      placeholder="Écrivez votre la description et ou le résultat de l'événement ici...

Vous pouvez utiliser du Markdown :
- # Titre de niveau 1 
- **texte en gras**
- *texte en italique*
- [liens](https://example.com)
- `code`
- voir plus bas pour le guide du Markdown.

Deposé des fichiers (pdf et images) pour les insérer directement dans le contenu !
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
                <EventsDisplay
                  metadata={{
                    title: formData.title,
                    author: formData.author,
                    startDate: ensureValidDate(formData.startDate),
                    endDate: ensureValidDate(formData.endDate),
                    location: formData.location,
                    maxAttendees: formData.maxAttendees,
                    thumbnailUrl: formData.thumbnailUrl,
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

export default EventsForm;
