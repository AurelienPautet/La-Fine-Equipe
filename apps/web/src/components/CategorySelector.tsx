import React from "react";
import { useState, useEffect, useRef } from "react";
import type { Categories } from "@lafineequipe/types";
import { useAllCategories } from "../hooks/CategoriesHooks";
import { FaCheck } from "react-icons/fa";
import Popover from "./Popover";

interface CategorySelectorProps {
  selectedCategory: Categories | null;
  onCategoryChange: (category: Categories) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const { data: categories, error, isLoading } = useAllCategories();

  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<
    "dropdown-start" | "dropdown-end"
  >("dropdown-start");

  useEffect(() => {
    const updateDropdownPosition = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const containerCenter = containerRect.left + containerRect.width / 2;
        if (containerCenter < windowWidth / 2) {
          setDropdownPosition("dropdown-start");
        } else {
          setDropdownPosition("dropdown-end");
        }
      }
    };

    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, []);

  const handleSelectCategory = (category: Categories) => {
    onCategoryChange(category);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  } else if (error) {
    return <div>Erreur lors du chargement des catégories</div>;
  }

  return (
    <div className="w-full" ref={containerRef}>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-sm font-semibold">
            Catégorie <span className="text-error">*</span>
          </span>
        </label>
        <Popover
          trigger={
            <div className="btn btn-outline btn-primary w-full justify-start">
              {selectedCategory ? (
                <span className="flex items-center gap-2">
                  <FaCheck className="w-4 h-4" />
                  {selectedCategory.name}
                </span>
              ) : (
                <span className="text-base-content/50">
                  Sélectionnez une catégorie...
                </span>
              )}
            </div>
          }
          dropdownClassName="menu bg-white rounded-box w-56 p-2 shadow-lg z-50"
          align={dropdownPosition}
        >
          <ul className="space-y-1 w-full overflow-x-hidden">
            <ul className="h-fit max-h-60 overflow-y-auto overflow-x-hidden">
              {categories && categories.length > 0 ? (
                categories.map((category: Categories) => (
                  <li key={category.id}>
                    <button
                      type="button"
                      className={`w-full text-left px-4 py-2 rounded transition-colors ${
                        selectedCategory?.id === category.id
                          ? "bg-primary text-primary-content font-semibold"
                          : "hover:bg-base-200"
                      }`}
                      onClick={() => {
                        handleSelectCategory(category);
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {selectedCategory?.id === category.id && (
                          <FaCheck className="w-4 h-4" />
                        )}
                        {category.name}
                      </span>
                    </button>
                  </li>
                ))
              ) : (
                <li>
                  <div className="px-4 py-2">Aucune catégorie disponible</div>
                </li>
              )}
            </ul>
          </ul>
        </Popover>
        {!selectedCategory && (
          <label className="label">
            <span className="label-text-alt text-error text-xs">
              Vous devez sélectionner une catégorie
            </span>
          </label>
        )}
      </div>
    </div>
  );
};

export default CategorySelector;
