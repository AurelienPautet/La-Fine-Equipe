import React, { useState, useEffect } from "react";
import type {
  HomeSection,
  CreateHomeSectionRequest,
  EditHomeSectionRequest,
} from "@lafineequipe/types";
import {
  usePostHomeSection,
  useEditHomeSection,
} from "../hooks/HomeSectionHooks";
import UploadFileButton from "./UploadFileButton";

interface HomeSectionManagerProps {
  editingSection: HomeSection | null;
  onClose?: () => void;
}

const HomeSectionManager: React.FC<HomeSectionManagerProps> = ({
  editingSection,
  onClose,
}) => {
  const postHomeSection = usePostHomeSection();
  const editHomeSection = useEditHomeSection();

  const [formData, setFormData] = useState<
    CreateHomeSectionRequest | EditHomeSectionRequest
  >({
    title: "",
    content: "",
    buttonLabel: undefined,
    buttonLink: undefined,
    imageUrl: undefined,
    isVisible: true,
  });

  useEffect(() => {
    if (editingSection) {
      setFormData({
        id: editingSection.id,
        title: editingSection.title,
        content: editingSection.content,
        buttonLabel: editingSection.buttonLabel || undefined,
        buttonLink: editingSection.buttonLink || undefined,
        imageUrl: editingSection.imageUrl || undefined,
        isVisible: editingSection.isVisible,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        buttonLabel: undefined,
        buttonLink: undefined,
        imageUrl: undefined,
        isVisible: true,
      });
    }
  }, [editingSection]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSection) {
        await editHomeSection.mutateAsync(formData as EditHomeSectionRequest);
      } else {
        await postHomeSection.mutateAsync(formData as CreateHomeSectionRequest);
      }
      // Reset form after successful submission
      setFormData({
        title: "",
        content: "",
        buttonLabel: undefined,
        buttonLink: undefined,
        imageUrl: undefined,
        isVisible: true,
      });
      // Close modal if callback provided
      onClose?.();
    } catch (error) {
      console.error("Error saving home section:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Titre</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="input input-bordered input-primary"
          placeholder="Titre de la section"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Contenu (Markdown)</span>
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          className="textarea textarea-bordered textarea-primary min-h-32 font-mono"
          placeholder="Écrivez votre contenu en Markdown..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Libellé du bouton (optionnel)
            </span>
          </label>
          <input
            type="text"
            name="buttonLabel"
            value={formData.buttonLabel || ""}
            onChange={handleInputChange}
            className="input input-bordered input-primary"
            placeholder="En savoir plus"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Lien du bouton (optionnel)
            </span>
          </label>
          <input
            type="url"
            name="buttonLink"
            value={formData.buttonLink || ""}
            onChange={handleInputChange}
            className="input input-bordered input-primary"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Image (optionnel)</span>
        </label>
        <div className="flex flex-row items-center gap-2">
          <UploadFileButton
            folder="home-sections"
            onFileUploaded={(url) =>
              setFormData((prev) => ({
                ...prev,
                imageUrl: url,
              }))
            }
            buttonText="Télécharger une image"
          />
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl || ""}
            onChange={handleInputChange}
            className="input input-bordered input-primary flex-1"
            placeholder="Ou collez une URL d'image..."
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            name="isVisible"
            checked={formData.isVisible}
            onChange={handleInputChange}
            className="checkbox checkbox-primary"
          />
          <span className="label-text font-semibold">Visible sur le site</span>
        </label>
      </div>

      <div className="flex flex-row justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={() => onClose?.()}
          className="btn btn-ghost"
        >
          Fermer
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={postHomeSection.isPending || editHomeSection.isPending}
        >
          {postHomeSection.isPending || editHomeSection.isPending
            ? "Enregistrement..."
            : "Enregistrer"}
        </button>
      </div>
    </form>
  );
};

export default HomeSectionManager;
