import React from "react";
import { Link } from "react-router-dom";
import { useRegulations } from "../hooks/RegulationHooks";
import RegulationCard from "../components/RegulationCard";
import PageHeader from "../components/PageHeader";
import { FaFileAlt, FaSpinner, FaPlus } from "react-icons/fa";

const RegulationsPage: React.FC = () => {
  const { data: regulations, isLoading, isError, error } = useRegulations();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg">Chargement des règlements...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <FaFileAlt className="w-6 h-6" />
          <span>
            Erreur lors du chargement des règlements: {error?.message}
          </span>
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
        {/* Create New Regulation Button */}
        <div className="mt-8">
          <Link
            to="/regulations/create"
            className="btn btn-secondary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaPlus className="w-5 h-5" />
            Créer un nouveau règlement
          </Link>
        </div>
      </PageHeader>

      <div className="container mx-auto px-4 py-12">
        {regulations && regulations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regulations.map((regulation) => (
              <RegulationCard key={regulation.id} regulation={regulation} />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-base-100 rounded-xl p-12 shadow-lg">
              <FaFileAlt className="w-16 h-16 mx-auto mb-6 text-primary/50" />
              <h3 className="text-2xl font-bold mb-4 text-base-content">
                Aucun règlement pour le moment
              </h3>
              <p className="text-base-content/70 mb-8">
                Soyez le premier à créer un règlement !
              </p>
              <Link
                to="/regulations/create"
                className="btn btn-primary btn-lg gap-2"
              >
                <FaPlus className="w-5 h-5" />
                Créer le premier règlement
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegulationsPage;
