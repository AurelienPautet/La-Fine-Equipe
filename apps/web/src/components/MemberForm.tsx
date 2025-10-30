import React, { useState } from "react";
import type {
  TeamMember,
  CreateTeamMemberRequest,
  EditTeamMemberRequest,
} from "@lafineequipe/types";
import UploadFileButton from "./UploadFileButton";

interface MemberFormProps {
  member?: TeamMember;
  divisionId: number;
  isLoading?: boolean;
  onSubmit: (data: CreateTeamMemberRequest | EditTeamMemberRequest) => void;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({
  member,
  divisionId,
  isLoading = false,
  onSubmit,
  onCancel,
}) => {
  const isEdit = !!member;
  const [photoUrl, setPhotoUrl] = useState(member?.photoUrl ?? "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const firstName = fd.get("firstName") as string;
    const lastName = fd.get("lastName") as string;
    const role = fd.get("role") as string;
    const emailRaw = fd.get("email") as string;
    const email = emailRaw && emailRaw.trim() ? emailRaw : undefined;
    if (isEdit) {
      onSubmit({
        id: member!.id,
        firstName,
        lastName,
        role,
        email,
        photoUrl: photoUrl,
        divisionId,
        isActive: true,
      } as EditTeamMemberRequest);
    } else {
      onSubmit({
        firstName,
        lastName,
        role,
        email,
        photoUrl: photoUrl,
        divisionId,
        isActive: true,
      } as CreateTeamMemberRequest);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Éditer Membre" : "Ajouter un Membre"}
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Prénom</span>
          </label>
          <input
            className="input input-bordered"
            name="firstName"
            defaultValue={member?.firstName ?? ""}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Nom</span>
          </label>
          <input
            className="input input-bordered"
            name="lastName"
            defaultValue={member?.lastName ?? ""}
            required
          />
        </div>
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text font-semibold mr-2">Rôle</span>
        </label>
        <input
          className="input input-bordered"
          name="role"
          defaultValue={member?.role ?? ""}
          required
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text font-semibold mr-2">
            Email (optionnel)
          </span>
        </label>
        <input
          type="email"
          className="input input-bordered"
          name="email"
          defaultValue={member?.email ?? ""}
        />
      </div>

      <div className="form-control mb-6">
        <label className="label">
          <span className="label-text font-semibold mr-2">Photo</span>
        </label>
        <div className="flex gap-3 items-center mb-3">
          <UploadFileButton
            folder="members"
            onFileUploaded={setPhotoUrl}
            buttonText="Télécharger une photo"
          />
        </div>
        <input
          className="input input-bordered"
          name="photoUrl"
          placeholder="Ou collez une URL de photo"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          required
        />
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

export default MemberForm;
