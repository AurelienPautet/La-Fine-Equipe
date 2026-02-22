import React, { useState, useEffect } from "react";
import type {
  CreateHomeSectionRequest,
  EditHomeSectionRequest,
  HomeSectionWithButtons,
} from "@lafineequipe/types";
import {
  usePostHomeSection,
  useEditHomeSection,
} from "../hooks/HomeSectionHooks";
import UploadFileButton from "./UploadFileButton";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useToast } from "./Toaster";

interface HomeSectionManagerProps {
  editingSection: HomeSectionWithButtons | null;
  onClose?: () => void;
}

const HomeSectionManager: React.FC<HomeSectionManagerProps> = ({
  editingSection,
  onClose,
}) => {
  const postHomeSection = usePostHomeSection();
  const editHomeSection = useEditHomeSection();
  const { toast } = useToast();

  const [formData, setFormData] = useState<
    CreateHomeSectionRequest | EditHomeSectionRequest
  >({
    title: "",
    content: "",
    buttons: [],
    imageUrl: undefined,
    isVisible: true,
  });

  useEffect(() => {
    if (editingSection) {
      setFormData({
        id: editingSection.id,
        title: editingSection.title,
        content: editingSection.content,
        buttons: editingSection.buttons || [],
        imageUrl: editingSection.imageUrl || undefined,
        isVisible: editingSection.isVisible,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        buttons: [],
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
      setFormData({
        title: "",
        content: "",
        buttons: [],
        imageUrl: undefined,
        isVisible: true,
      });
      onClose?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de l'enregistrement de la section"
      );
    }
  };

  const addButton = () => {
    setFormData((prev) => ({
      ...prev,
      buttons: [
        ...(prev.buttons || []),
        { label: "", link: "", order: prev.buttons?.length || 0 },
      ],
    }));
  };

  const removeButton = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      buttons: prev.buttons?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateButton = (
    index: number,
    field: "label" | "link",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      buttons:
        prev.buttons?.map((btn, i) =>
          i === index ? { ...btn, [field]: value } : btn
        ) || [],
    }));
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

      <div className="divider">Boutons</div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="label">
            <span className="label-text font-semibold">
              Boutons d&apos;action (optionnel)
            </span>
          </label>
          <button
            type="button"
            onClick={addButton}
            className="btn btn-sm btn-primary"
          >
            <FaPlus className="w-4 h-4" />
            Ajouter un bouton
          </button>
        </div>

        {formData.buttons && formData.buttons.length > 0 && (
          <div className="space-y-3">
            {formData.buttons.map((button, index) => (
              <div
                key={index}
                className="card card-border bg-base-200 p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold">
                    Bouton {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeButton(index)}
                    className="btn btn-xs btn-error btn-ghost"
                    title="Supprimer"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>

                <div className="form-control">
                  <input
                    type="text"
                    value={button.label}
                    onChange={(e) =>
                      updateButton(index, "label", e.target.value)
                    }
                    className="input input-sm input-bordered"
                    placeholder="Libellé du bouton"
                    required={formData.buttons && formData.buttons.length > 0}
                  />
                </div>

                <div className="form-control">
                  <input
                    type="url"
                    value={button.link}
                    onChange={(e) =>
                      updateButton(index, "link", e.target.value)
                    }
                    className="input input-sm input-bordered"
                    placeholder="https://example.com"
                    required={formData.buttons && formData.buttons.length > 0}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
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
