import React from "react";
import { FaBook, FaPlus, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import EventsCard from "../components/EventCard";
import type { EventsWithTags } from "@lafineequipe/types";
import { useEvents } from "../hooks/EventHooks";
import PageHeader from "../components/PageHeader";
const EventsPage: React.FC = () => {
  const { data: events, isLoading, isError, error } = useEvents();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center">
        <PageHeader
          title="Nos Events"
          subtitle="Découvrez nos derniers events, événements et aventures de La Fine Équipe"
          icon={<FaBook className="w-12 h-12" />}
          className="py-20 w-full"
        />
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <FaBook className="w-6 h-6" />
          <span>
            Erreur lors du chargement des événements: {error?.message}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <PageHeader
        title="Nos Events"
        subtitle="Découvrez nos derniers events, événements et aventures de La Fine Équipe"
        icon={<FaBook className="w-12 h-12" />}
        className="py-20"
      >
        {/* Create New Events Button */}
        <div className="mt-8">
          <Link
            to="/events/create"
            className="btn btn-secondary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaPlus className="w-5 h-5" />
            Créer un nouvel events
          </Link>
        </div>
      </PageHeader>

      {/* Events Section */}
      <div className="container mx-auto px-4 py-16">
        {events && events.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-base-content">
              Tous nos events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: EventsWithTags) => (
                <EventsCard key={event.id} events={event} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-base-100 rounded-xl p-12 shadow-lg">
              <FaBook className="w-16 h-16 mx-auto mb-6 text-primary/50" />
              <h3 className="text-2xl font-bold mb-4 text-base-content">
                Aucun événement pour le moment
              </h3>
              <p className="text-base-content/70 mb-8">
                Soyez le premier à créer un événement !
              </p>
              <Link
                to="/events/create"
                className="btn btn-primary btn-lg gap-2"
              >
                <FaPlus className="w-5 h-5" />
                Créer le premier événement
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
