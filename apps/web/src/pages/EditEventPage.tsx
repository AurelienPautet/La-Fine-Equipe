import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import EventsForm from "../components/EventForm";
import PageHeader from "../components/PageHeader";
import MarkdownGuide from "../components/MarkdownGuide";
import type { CreateEventsRequest } from "@lafineequipe/types";
import { useEditEvents, useEvent } from "../hooks/EventHooks";

const EditEventsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: events, error, isLoading: loading } = useEvent(slug || "");
  const editEvents = useEditEvents();

  const handleSubmit = async (formData: CreateEventsRequest) => {
    setIsSubmitting(true);
    try {
      let res = await editEvents.mutateAsync({
        eventsData: { ...formData, id: events?.id as number },
      });
      navigate(`/events/${res.slug}`);
    } catch (error) {
      console.error("Failed to edit events:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !events) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent to-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-xl text-base-content">Chargement de l'events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-base-200">
      {/* Header */}
      <PageHeader
        title="Modifier l'Events"
        subtitle="Modifiez votre events et partagez vos idées avec La Fine Équipe"
        icon={<FaEdit className="w-10 h-10" />}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              to={`/events/${slug}`}
              className="btn btn-outline btn-primary hover:btn-primary transition-all duration-300 flex items-center gap-2 w-fit"
            >
              <FaArrowLeft className="w-4 h-4" />
              Retour à l'events
            </Link>
            <Link
              to="/events"
              className="btn btn-outline btn-secondary hover:btn-secondary transition-all duration-300 flex items-center gap-2 w-fit"
            >
              Voir tous les events
            </Link>
          </div>

          {/* Events Form */}
          <EventsForm
            initialData={events}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="Sauvegarder les modifications"
            submitButtonLoadingText="Modification en cours..."
          />

          {/* Help Card */}
          <MarkdownGuide />
        </div>
      </div>
    </div>
  );
};

export default EditEventsPage;
