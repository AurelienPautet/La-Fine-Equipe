import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePostRegulation } from "../hooks/RegulationHooks";
import RegulationForm from "../components/RegulationForm";
import PageHeader from "../components/PageHeader";
import { FaFileAlt } from "react-icons/fa";
import type { CreateRegulationRequest } from "@lafineequipe/types";
import { useAuth } from "../components/AuthProvider";
import LoginButton from "../components/LoginButton";
import { useToast } from "../components/Toaster";

const CreateRegulationPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const postRegulation = usePostRegulation();
  const { toast } = useToast();

  const state = useLocation().state;
  const initialData: CreateRegulationRequest = {
    title: "",
    description: "",
    categoryId: state?.categoryId || "",
    date: new Date(),
    content: "",
  };
  const handleSubmit = async (data: CreateRegulationRequest) => {
    try {
      await postRegulation.mutateAsync(data);
      navigate("/regulations");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la création du règlement"
      );
    }
  };

  if (!isAuthenticated) {
    return <LoginButton />;
  }

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
