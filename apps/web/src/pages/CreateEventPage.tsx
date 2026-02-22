import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import EventsForm from "../components/EventForm";
import PageHeader from "../components/PageHeader";
import MarkdownGuide from "../components/MarkdownGuide";
import { usePostEvents } from "../hooks/EventHooks";
import { useAuth } from "../components/AuthProvider";
import LoginButton from "../components/LoginButton";
import { useToast } from "../components/Toaster";

const CreateEventsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const postEvents = usePostEvents();

  const initialFormData: any = {
    title: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    tags: "",
    content: "",
    reservationUrl: undefined,
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    postEvents.mutate(formData, {
      onSuccess: () => {
        navigate("/events");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors de la création de l'événement"
        );
        setIsSubmitting(false);
      },
    });
  };

  if (!isAuthenticated) {
    return <LoginButton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-base-200">
      {/* Header */}
      <PageHeader
        title="Créer un événement"
        subtitle="Partagez vos idées et expériences avec La Fine Équipe"
        icon={<FaEdit className="w-10 h-10" />}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link
              to="/events"
              className="btn btn-outline btn-primary hover:btn-primary transition-all duration-300 flex items-center gap-2 w-fit"
            >
              <FaArrowLeft className="w-4 h-4" />
              Retour aux events
            </Link>
          </div>

          {/* Events Form */}
          <EventsForm
            initialData={initialFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="Créer l'events"
            submitButtonLoadingText="Création en cours..."
          />

          {/* Help Card */}
          <MarkdownGuide />
        </div>
      </div>
    </div>
  );
};

export default CreateEventsPage;
