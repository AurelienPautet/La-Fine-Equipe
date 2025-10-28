import React from "react";
import type { CreateCategoryRequest } from "@lafineequipe/types";

interface CategoryFormProps {
  categoryData: CreateCategoryRequest;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: "idle" | "submitting" | "success" | "error";
  onCancel: () => void;
  isEdit?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryData,
  onInputChange,
  onSubmit,
  status,
  onCancel,
  isEdit = false,
}) => {
  const title = isEdit ? "Modifier la catégorie" : "Créer une catégorie";
  const submitLabel = isEdit ? "Modifier" : "Créer";
  const loadingLabel = isEdit
    ? "Modification en cours..."
    : "Création en cours...";
  const successMessage = isEdit
    ? "Catégorie modifiée avec succès!"
    : "Catégorie créée avec succès!";
  const errorMessage = isEdit
    ? "Erreur lors de la modification de la catégorie."
    : "Erreur lors de la création de la catégorie.";

  return (
    <>
      <h3 className="font-bold text-lg">{title}</h3>

      {status === "success" && (
        <div className="alert alert-success my-4">
          <p>{successMessage}</p>
        </div>
      )}

      {status === "error" && (
        <div className="alert alert-error my-4">
          <p>{errorMessage}</p>
        </div>
      )}

      {status !== "success" && (
        <form onSubmit={onSubmit} className="flex flex-col gap-4 py-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nom de la catégorie</span>
            </label>
            <input
              type="text"
              name="name"
              value={categoryData.name}
              onChange={onInputChange}
              placeholder={isEdit ? "" : "Ex: Sécurité"}
              className="input input-bordered input-sm"
              disabled={status === "submitting"}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Abréviation</span>
            </label>
            <input
              type="text"
              name="abbreviation"
              value={categoryData.abbreviation}
              onChange={onInputChange}
              placeholder={isEdit ? "" : "Ex: SEC"}
              className="input input-bordered input-sm"
              disabled={status === "submitting"}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Schéma de titre</span>
            </label>
            <input
              type="text"
              name="titleSchema"
              value={categoryData.titleSchema}
              onChange={onInputChange}
              placeholder={isEdit ? "" : "Ex: Acte n°[title] du [date]"}
              className="input input-bordered input-sm"
              disabled={status === "submitting"}
              required
            />
            <p className="text-xs text-secondary/50">
              Utilisez <code>[date]</code> pour la date et <code>[titre]</code>{" "}
              pour le titre du règlement.
            </p>
          </div>

          {status === "submitting" && (
            <div className="flex items-center justify-center">
              <span className="loading loading-spinner loading-sm"></span>
              <span className="ml-2">{loadingLabel}</span>
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={status === "submitting"}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={status === "submitting"}
            >
              {submitLabel}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default CategoryForm;
