import React, { useState } from "react";
import { usePostCategories } from "../hooks/CategoriesHooks";
import type { CreateCategoryRequest } from "@lafineequipe/types";
import CategoryForm from "./CategoryForm";

const CreateCategoryButton: React.FC = () => {
  const createCategoryMutation = usePostCategories();
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorText, setErrorText] = useState<string>("");
  const [categoryData, setCategoryData] = useState<CreateCategoryRequest>({
    name: "",
    abbreviation: "",
    titleSchema: "",
    order: 0,
  });

  const openModal = () => {
    const modal = document.getElementById(
      "create_category_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById(
      "create_category_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    createCategoryMutation.mutate(categoryData, {
      onSuccess: () => {
        setStatus("success");
        setCategoryData({
          name: "",
          abbreviation: "",
          titleSchema: "",
          order: 0,
        });
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
        setTimeout(() => {
          setStatus("idle");
        }, 2000);
      },
      onError: (error) => {
        setErrorText(
          error instanceof Error ? error.message : "Erreur lors de la création de la catégorie"
        );
        setStatus("error");
      },
    });
  };

  return (
    <div>
      <button className="btn btn-primary btn-sm" onClick={openModal}>
        + Ajouter catégorie
      </button>
      <dialog id="create_category_modal" className="modal">
        <div className="modal-box w-full max-w-md">
          <CategoryForm
            categoryData={categoryData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            status={status}
            onCancel={handleCloseModal}
            isEdit={false}
            errorText={errorText}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default CreateCategoryButton;
