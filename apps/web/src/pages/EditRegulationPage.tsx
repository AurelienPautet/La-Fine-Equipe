import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRegulation, useEditRegulation } from "../hooks/RegulationHooks";
import RegulationForm from "../components/RegulationForm";
import PageHeader from "../components/PageHeader";
import { FaFileAlt, FaSpinner } from "react-icons/fa";
import type {
  EditRegulationRequest,
  CreateRegulationRequest,
} from "@lafineequipe/types";

const EditRegulationPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: regulation, isLoading, isError } = useRegulation(slug!);
  const editRegulation = useEditRegulation();

  const handleSubmit = async (
    data: CreateRegulationRequest | EditRegulationRequest
  ) => {
    if (!regulation) return;

    try {
      const res = await editRegulation.mutateAsync({
        regulationData: {
          ...data,
          id: regulation.id,
        },
      });
      navigate(`/regulations/${res.slug}`);
    } catch (error) {
      console.error("Failed to edit regulation:", error);
    }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <FaFileAlt className="w-6 h-6" />
          <span>Erreur: Règlement non trouvé</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <PageHeader
        title="Modifier le règlement"
        subtitle={`Modification de "${regulation.title}"`}
        icon={<FaFileAlt className="w-12 h-12" />}
      />

      <div className="container mx-auto px-4 py-8">
        <RegulationForm
          initialData={regulation}
          onSubmit={handleSubmit}
          isSubmitting={editRegulation.isPending}
          submitButtonText="Sauvegarder les modifications"
          submitButtonLoadingText="Sauvegarde en cours..."
        />
      </div>
    </div>
  );
};

export default EditRegulationPage;
