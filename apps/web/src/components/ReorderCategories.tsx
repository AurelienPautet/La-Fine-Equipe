import React, { useState, useEffect } from "react";
import {
  useAllCategories,
  useReorderCategories,
} from "../hooks/CategoriesHooks";
import type { Categories, ReorderCategoriesRequest } from "@lafineequipe/types";
import { TbReorder } from "react-icons/tb";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const ReorderCategories: React.FC = () => {
  const { data: categories = [], isLoading, error } = useAllCategories();
  const reorderCategoriesMutation = useReorderCategories();
  const [orderedCategories, setOrderedCategories] = useState<Categories[]>([]);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const modalId = "reorder_categories_modal";

  useEffect(() => {
    if (categories.length > 0) {
      setOrderedCategories([...categories].sort((a, b) => a.order - b.order));
    }
  }, [categories]);

  const openModal = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  const moveCategory = (index: number, direction: "up" | "down") => {
    const newOrder = [...orderedCategories];
    if (direction === "up" && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [
        newOrder[index - 1],
        newOrder[index],
      ];
    } else if (direction === "down" && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [
        newOrder[index + 1],
        newOrder[index],
      ];
    }
    setOrderedCategories(newOrder);
  };

  const handleSubmit = () => {
    setStatus("submitting");

    const reorderData: ReorderCategoriesRequest[] = orderedCategories.map(
      (category, index) => ({
        id: category.id,
        order: index + 1,
      })
    );

    reorderCategoriesMutation.mutate(reorderData, {
      onSuccess: () => {
        setStatus("success");
        setTimeout(() => {
          setStatus("idle");
          handleCloseModal();
        }, 1500);
      },
      onError: (error) => {
        console.error("Error reordering categories:", error);
        setStatus("error");
      },
    });
  };

  const handleReset = () => {
    if (categories.length > 0) {
      setOrderedCategories([...categories].sort((a, b) => a.order - b.order));
    }
  };

  if (error) {
    return (
      <>
        <button
          className="btn btn-ghost btn-sm"
          onClick={openModal}
          title="Réorganiser les catégories"
        >
          <TbReorder className="w-4 h-4 " />
          Réordonner les catégories
        </button>
        <dialog id={modalId} className="modal">
          <div className="modal-box w-full max-w-md">
            <h3 className="font-bold text-lg">Réorganiser les catégories</h3>
            <div className="alert alert-error my-4">
              Erreur lors du chargement des catégories
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleCloseModal}>
                Fermer
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </>
    );
  }

  const hasChanges = orderedCategories.some(
    (cat, index) => cat.order !== index + 1
  );

  return (
    <>
      <button
        className="btn btn-ghost btn-sm"
        onClick={openModal}
        title="Réorganiser les catégories"
        disabled={categories.length === 0}
      >
        <TbReorder className="w-4 h-4 " />
        Réordonner les catégories
      </button>
      <dialog id={modalId} className="modal">
        <div className="modal-box w-full max-w-2xl">
          <h3 className="font-bold text-lg">Réorganiser les catégories</h3>

          {status === "success" && (
            <div className="alert alert-success my-4">
              <p>Catégories réorganisées avec succès!</p>
            </div>
          )}

          {status === "error" && (
            <div className="alert alert-error my-4">
              <p>Erreur lors de la réorganisation des catégories.</p>
            </div>
          )}

          {status !== "success" && (
            <>
              <div className="space-y-2 my-4 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <span className="loading loading-spinner"></span>
                  </div>
                ) : orderedCategories.length === 0 ? (
                  <div className="alert alert-info">
                    Aucune catégorie disponible
                  </div>
                ) : (
                  orderedCategories.map((category, index) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between bg-base-200 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="badge badge-primary">{index + 1}</span>
                        <div>
                          <p className="font-semibold">{category.name}</p>
                          <p className="text-sm text-base-content/70">
                            {category.abbreviation}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => moveCategory(index, "up")}
                          disabled={index === 0 || status === "submitting"}
                          className="btn btn-ghost btn-xs"
                          title="Monter"
                        >
                          <FaArrowUp className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => moveCategory(index, "down")}
                          disabled={
                            index === orderedCategories.length - 1 ||
                            status === "submitting"
                          }
                          className="btn btn-ghost btn-xs"
                          title="Descendre"
                        >
                          <FaArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {status === "submitting" && (
                <div className="flex items-center justify-center my-4">
                  <span className="loading loading-spinner"></span>
                  <span className="ml-2">Réorganisation en cours...</span>
                </div>
              )}

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleReset}
                  disabled={!hasChanges || status === "submitting"}
                >
                  Réinitialiser
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleCloseModal}
                  disabled={status === "submitting"}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!hasChanges || status === "submitting"}
                >
                  Enregistrer
                </button>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ReorderCategories;
