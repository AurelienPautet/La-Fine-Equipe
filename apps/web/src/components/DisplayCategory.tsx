import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import EditCategoryButton from "./EditCategoryButton";
import { FaPlus } from "react-icons/fa";
import type { Categories, Regulation } from "@lafineequipe/types";
import RegulationCard from "./RegulationCard";

interface DisplayCategoryProps {
  category: Categories;
  regulations: Regulation[];
}

const DisplayCategory: React.FC<DisplayCategoryProps> = ({
  category,
  regulations,
}) => {
  const categoryRegulations = useMemo(
    () => regulations.filter((reg) => reg.categoryId === category.id),
    [regulations, category.id]
  );

  return (
    <div className="card bg-base-100 shadow-lg border border-base-300 mb-8">
      {/* Category Header */}
      <div className="card-body">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="badge badge-primary badge-lg font-bold">
              {category.abbreviation}
            </div>
            <h2 className="card-title text-2xl text-secondary">
              {category.name}
            </h2>
          </div>
          <EditCategoryButton category={category} />
        </div>

        <div className="divider my-0"></div>

        {/* Schema info */}
        <p className="text-sm text-base-content/70 mt-4 mb-4">
          <span className="font-semibold">Schéma de titre:</span>{" "}
          {category.titleSchema}
        </p>

        {/* Regulations List */}
        <div className="mt-6">
          {categoryRegulations.length > 0 ? (
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                Règlements ({categoryRegulations.length})
              </h3>
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {categoryRegulations.map((regulation) => (
                  <RegulationCard
                    key={regulation.id}
                    regulation={regulation}
                    category={category}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-base-200 rounded-lg p-6 text-center">
              <p className="text-base-content/70 mb-4">
                Aucun règlement dans cette catégorie
              </p>
            </div>
          )}
        </div>

        {/* Create Regulation Button */}
        <div className="card-actions mt-6">
          <Link
            to="/regulations/create"
            state={{ categoryId: category.id }}
            className="btn btn-secondary btn-sm gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Ajouter un règlement
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DisplayCategory;
