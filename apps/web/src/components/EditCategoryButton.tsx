import React, { useState, useEffect } from "react";
import { useEditCategories } from "../hooks/CategoriesHooks";
import type { Categories, CreateCategoryRequest } from "@lafineequipe/types";
import CategoryForm from "./CategoryForm";
import { FaEdit } from "react-icons/fa";

interface EditCategoryButtonProps {
  category: Categories;
}

const EditCategoryButton: React.FC<EditCategoryButtonProps> = ({
  category,
}) => {
  const editCategoryMutation = useEditCategories();
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [categoryData, setCategoryData] = useState<CreateCategoryRequest>({
    name: category.name,
    abbreviation: category.abbreviation,
    titleSchema: category.titleSchema,
    order: 0,
  });

  useEffect(() => {
    setCategoryData({
      name: category.name,
      abbreviation: category.abbreviation,
      titleSchema: category.titleSchema,
      order: 0,
    });
  }, [category]);

  const modalId = `edit_category_modal_${category.id}`;

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    editCategoryMutation.mutate(
      { id: category.id, categoryData },
      {
        onSuccess: () => {
          setStatus("success");
          setTimeout(() => {
            handleCloseModal();
          }, 1500);
          setTimeout(() => {
            setStatus("idle");
          }, 2000);
        },
        onError: (error) => {
          console.error("Error editing category:", error);
          setStatus("error");
        },
      }
    );
  };

  return (
    <div>
      <button
        className="btn btn-ghost btn-sm gap-2"
        onClick={openModal}
        title="Modifier cette catégorie"
      >
        <FaEdit className="w-4 h-4" />
      </button>
      <dialog id={modalId} className="modal">
        <div className="flex items-center flex-col modal-box w-full max-w-md">
          <CategoryForm
            categoryData={categoryData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            status={status}
            onCancel={handleCloseModal}
            isEdit={true}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default EditCategoryButton;
