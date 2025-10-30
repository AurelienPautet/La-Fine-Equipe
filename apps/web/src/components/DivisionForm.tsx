import React from "react";
import type {
  Division,
  CreateDivisionRequest,
  EditDivisionRequest,
} from "@lafineequipe/types";

interface DivisionFormProps {
  division?: Division | null;
  isLoading?: boolean;
  onSubmit: (data: CreateDivisionRequest | EditDivisionRequest) => void;
  onCancel: () => void;
}

const DivisionForm: React.FC<DivisionFormProps> = ({
  division,
  isLoading = false,
  onSubmit,
  onCancel,
}) => {
  const isEdit = !!division;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const color = fd.get("color") as string;
    const titleSchema = fd.get("titleSchema") as string;

    if (isEdit) {
      onSubmit({
        id: division!.id,
        name,
        color,
        titleSchema,
      } as EditDivisionRequest);
    } else {
      onSubmit({
        name,
        color,
        titleSchema,
      } as CreateDivisionRequest);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Éditer un Pôle" : "Ajouter un Pôle"}
      </h2>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text font-semibold mr-2">Nom</span>
        </label>
        <input
          className="input input-bordered"
          name="name"
          defaultValue={division?.name ?? ""}
          required
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text font-semibold mr-2">
            Couleur principale
          </span>
        </label>
        <input
          type="color"
          className="input input-bordered w-20 h-10 p-1 cursor-pointer"
          name="color"
          defaultValue={division?.color ?? "#fb923c"}
          required
        />
      </div>

      <div className="form-control mb-6">
        <label className="label">
          <span className="label-text font-semibold mr-2 mb-2">Titre</span>
        </label>
        <input
          className="input input-bordered"
          name="titleSchema"
          defaultValue={division?.titleSchema ?? ""}
          placeholder="ex: [role] de [pole]"
          required
        />
        <p className="text-xs opacity-70 mt-1">
          Utilisez <code>[role]</code> pour le rôle du membre et{" "}
          <code>[pole]</code> pour le nom du pôle.
        </p>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          {isEdit ? "Modifier" : "Créer"}
        </button>
      </div>
    </form>
  );
};

export default DivisionForm;
