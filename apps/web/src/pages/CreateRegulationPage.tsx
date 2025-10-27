import React from "react";
import { useNavigate } from "react-router-dom";
import { usePostRegulation } from "../hooks/RegulationHooks";
import RegulationForm from "../components/RegulationForm";
import PageHeader from "../components/PageHeader";
import { FaFileAlt } from "react-icons/fa";
import type { CreateRegulationRequest } from "@lafineequipe/types";

const CreateRegulationPage: React.FC = () => {
  const navigate = useNavigate();
  const postRegulation = usePostRegulation();

  const initialData: CreateRegulationRequest = {
    title: "",
    author: "",
    date: new Date(),
    content: "",
  };

  const handleSubmit = async (data: CreateRegulationRequest) => {
    try {
      await postRegulation.mutateAsync(data);
      navigate("/regulations");
    } catch (error) {
      console.error("Failed to create regulation:", error);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <PageHeader
        title="Créer un règlement"
        subtitle="Rédigez un nouveau règlement pour La Fine Équipe"
        icon={<FaFileAlt className="w-12 h-12" />}
      />

      <div className="container mx-auto px-4 py-8">
        <RegulationForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={postRegulation.isPending}
          submitButtonText="Publier le règlement"
          submitButtonLoadingText="Publication en cours..."
        />
      </div>
    </div>
  );
};

export default CreateRegulationPage;
