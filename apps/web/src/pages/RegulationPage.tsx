import React from "react";
import { useParams, Link } from "react-router-dom";
import { useRegulation, useDeleteRegulation } from "../hooks/RegulationHooks";
import RegulationDisplay from "../components/RegulationDisplay";
import { FaSpinner, FaFileAlt, FaEdit, FaPen } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import DeleteButton from "../components/DeleteButton";
import { useAuth } from "../components/AuthProvider";

const RegulationPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const { data: regulation, isLoading, isError } = useRegulation(slug!);
  const deleteRegulationMutation = useDeleteRegulation();

  const handleDelete = async (id: number) => {
    await deleteRegulationMutation.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg">Chargement du règlement...</p>
        </div>
      </div>
    );
  }

  if (isError || !regulation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent to-base-200 flex items-center justify-center">
        <div className="text-center w-full flex items-center flex-col">
          <FaFileAlt className="w-20 h-20" />
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Règlement non trouvé
          </h1>
          <p className="text-lg text-base-content mb-8">
            Désolé, nous n'avons pas pu trouver ce règlement.
          </p>
          <Link to="/regulations" className="btn btn-primary btn-lg">
            ← Retour aux règlements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-base-200">
      {/* Header */}
      <PageHeader
        title="Règlement"
        subtitle={` ${regulation.title}`}
        icon={<FaEdit className="w-10 h-10" />}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              to="/regulations"
              className="btn btn-outline btn-primary hover:btn-primary transition-all duration-300"
            >
              ← Retour aux règlements
            </Link>

            {/* Edit and Delete Buttons */}
            {slug && isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to={`/regulations/edit/${slug}`}
                  className="btn btn-secondary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
                >
                  <FaPen className="w-4 h-4" />
                  Modifier le règlement
                </Link>
                <DeleteButton
                  id={regulation?.id || 0}
                  entityName={`le règlement "${regulation?.title || ""}"`}
                  deleteMutation={handleDelete}
                  redirectPath="/regulations"
                  className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  confirmMessage={`Êtes-vous sûr de vouloir supprimer le règlement "${
                    regulation?.title || ""
                  }" ? Cette action est irréversible.`}
                />
              </div>
            )}
          </div>

          {/* Regulation Content */}
          <article className="card bg-base-100 shadow-2xl border-2 border-primary/20">
            <div className="card-body p-8 lg:p-12">
              {regulation && (
                <RegulationDisplay
                  metadata={{
                    title: regulation.title,
                    description: regulation.description,
                    date: regulation.date,
                  }}
                  content={regulation.content}
                  isPreview={false}
                />
              )}
            </div>
          </article>

          {/* Navigation Footer */}
          <div className="text-center mt-12">
            <Link
              to="/regulations"
              className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Voir plus de règlements
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulationPage;
