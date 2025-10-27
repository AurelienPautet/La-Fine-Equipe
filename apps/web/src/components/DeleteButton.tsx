import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface DeleteButtonProps {
  id: number;
  entityName: string;
  deleteMutation: (id: number) => Promise<void>;
  redirectPath?: string;
  onSuccess?: () => void;
  className?: string;
  confirmMessage?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  id,
  entityName,
  deleteMutation,
  redirectPath,
  onSuccess,
  className = "",
  confirmMessage,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMutation(id);

      if (onSuccess) {
        onSuccess();
      }

      if (redirectPath) {
        navigate(redirectPath);
      }
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error);
      alert(`Erreur lors de la suppression ${entityName}`);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className={`btn btn-error ${className}`}
        disabled={isDeleting}
      >
        <FaTrash className="w-4 h-4" />
      </button>

      {showConfirm && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmer la suppression</h3>
            <p className="py-4">
              {confirmMessage ||
                `Êtes-vous sûr de vouloir supprimer ${entityName} ? Cette action est irréversible.`}
            </p>
            <div className="modal-action">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn btn-ghost"
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-error"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Suppression...
                  </>
                ) : (
                  "Confirmer"
                )}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => !isDeleting && setShowConfirm(false)}
          >
            <button>close</button>
          </div>
        </dialog>
      )}
    </>
  );
};

export default DeleteButton;
