import React from "react";
import { useRegulations } from "../hooks/RegulationHooks";
import { useAllCategories } from "../hooks/CategoriesHooks";
import DisplayCategory from "../components/DisplayCategory";
import CreateCategoryButton from "../components/CreateCategoryButton";
import ReorderCategories from "../components/ReorderCategories";
import PageHeader from "../components/PageHeader";
import { FaFileAlt, FaSpinner } from "react-icons/fa";
import { useAuth } from "../components/AuthProvider";

const RegulationsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { data: regulations, isLoading: regulationsLoading } = useRegulations();
  const { data: categories, isLoading: categoriesLoading } = useAllCategories();

  const isLoading = regulationsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className=" h-screen w-screen flex flex-col items-center">
        <PageHeader
          title="Règlements"
          subtitle="Consultez tous les règlements de La Fine Équipe"
          icon={<FaFileAlt className="w-12 h-12" />}
          className="py-20 w-full"
        />
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg">Chargement des règlements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Règlements"
        subtitle="Consultez tous les règlements de La Fine Équipe"
        icon={<FaFileAlt className="w-12 h-12" />}
        className="py-20"
      >
        {/* Control Buttons */}
        {isAuthenticated && (
          <div className="mt-8 flex gap-4 flex-wrap justify-center">
            <CreateCategoryButton />
            <ReorderCategories />
          </div>
        )}
      </PageHeader>

      <div className="container mx-auto px-4 py-12">
        {/* Categories and Regulations */}
        {categories && categories.length > 0 ? (
          <div>
            {categories.map((category) => (
              <DisplayCategory
                key={category.id}
                category={category}
                regulations={regulations || []}
              />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-base-100 rounded-xl p-12 shadow-lg">
              <FaFileAlt className="w-16 h-16 mx-auto mb-6 text-primary/50" />
              <h3 className="text-2xl font-bold mb-4 text-base-content">
                Aucune catégorie pour le moment
              </h3>
              {isAuthenticated && (
                <>
                  <p className="text-base-content/70 mb-8">
                    Créez une catégorie pour commencer !
                  </p>
                  <CreateCategoryButton />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegulationsPage;
